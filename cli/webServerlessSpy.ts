import { Modal, Tooltip } from 'bootstrap';
import formatHighlight from 'json-format-highlight';
// import { sampleData } from './sampleData'; // Leave this for testing
import { EventBridgeBaseSpyEvent } from '../common/spyEvents/EventBridgeBaseSpyEvent';
import { FunctionBaseSpyEvent } from '../common/spyEvents/FunctionBaseSpyEvent';
import { SnsSpyEventBase } from '../common/spyEvents/SnsSpyEventBase';
import { SpyEvent } from '../common/spyEvents/SpyEvent';
import { SpyMessage } from '../common/spyEvents/SpyMessage';
import { getTopic } from '../listener/topic';

//needed because of strange bug in Bootstrap Tooltip
(window as any).process = { env: {} };

document.addEventListener('DOMContentLoaded', function () {
  run();
});

function run() {
  // ************* variables *************
  const spyMessages: (SpyMessageExt | SpyMessageGroup)[] = [];
  const snsEventsByMessageId: Record<string, SpyMessageExt<SnsSpyEventBase>[]> =
    {};
  const functionEventsByRequestId: Record<
    string,
    SpyMessageExt<FunctionBaseSpyEvent>[]
  > = {};
  const eventBridgeById: Record<
    string,
    SpyMessageExt<EventBridgeBaseSpyEvent>[]
  > = {};
  let uiNeedsRefresh = false;
  let stackList: string[] | undefined;
  const selectedStackLocalStorageKey = 'selectedStack';
  let ws: WebSocket;
  let selectedStack: string | undefined;

  // ************* HTML elements *************
  const tableBodyElement = document.getElementById('tableBody')!;
  const modalTimeElement = document.getElementById('time')!;
  const modalServiceKeyElement = document.getElementById('serviceKey')!;
  const modalDataElement = document.getElementById('data')!;
  const errorContentElement = document.getElementById('errorContent')!;
  const stackListContainerElement =
    document.getElementById('stackListContainer')!;
  const stackListElement = document.getElementById(
    'stackList'
  ) as HTMLSelectElement;
  const serviceKeyFilterInputElement = document.getElementById(
    'serviceKeyFilter'
  ) as HTMLInputElement;
  const dataFilterInputElement = document.getElementById(
    'dataFilter'
  ) as HTMLInputElement;
  const detailsModal = new Modal('#detailsModal', {
    backdrop: true,
    keyboard: true,
  });
  const errorModal = new Modal('#errorModal', {
    backdrop: true,
    keyboard: true,
  });

  // ************* events *************
  serviceKeyFilterInputElement.addEventListener('input', () => {
    uiNeedsRefresh = true;
  });
  dataFilterInputElement.addEventListener('input', () => {
    uiNeedsRefresh = true;
  });
  tableBodyElement.addEventListener('click', openDetails());
  stackListElement.addEventListener('change', () => {
    switchStack();
  });

  void (async () => {
    await fillStacks();
    await connectToWebSocket();
  })();
  window.requestAnimationFrame(render);
  setupTooltip();

  // Do not remove!
  // sample data for testing purposes
  // for (const sm of sampleData) {
  //   addSpyMessage(sm as any);
  // }

  function updateSelectedStack() {
    selectedStack = stackListElement.value;
    console.log(`Updating selected stack to ${selectedStack}`);
  }

  function switchStack() {
    updateSelectedStack();
    uiNeedsRefresh = true;
  }

  async function fillStacks() {
    const response = await fetch('/stackList');
    try {
      stackList = await response.json();
    } catch {
      stackList = [];
    }

    selectedStack = localStorage.getItem(selectedStackLocalStorageKey);

    stackListElement.innerHTML =
      stackList
        ?.map(
          (s) =>
            `<option value="${s}" ${
              selectedStack === s ? 'selected' : ''
            }>${s}</option>`
        )
        .join('') ?? '';
    updateSelectedStack();
    console.log(stackListContainerElement.style.display);
    stackListContainerElement.style.display =
      stackList && stackList.length > 1 ? '' : 'none';
  }

  async function connectToWebSocket() {
    try {
      const response = await fetch(`/wsUrl`);
      if (response.ok) {
        const url = await response.text();
        ws = new WebSocket(url);

        ws.addEventListener('open', () => {
          console.log(`Connected ${new Date().toISOString()} to IoT`);
        });
        ws.addEventListener('message', receiveSpyMessage());
        ws.addEventListener('close', () => {
          console.log(`Disconnected ${new Date().toISOString()}, reconnecting`);
          void connectToWebSocket();
        });
      } else {
        showError(await response.text());
      }
    } catch (err) {
      showError(err.message);
    }
  }

  function showError(messsage: string) {
    errorContentElement.innerHTML = messsage;
    errorModal.show();
  }

  function render() {
    if (uiNeedsRefresh) {
      tableBodyElement.innerHTML = spyMessages
        .map((sm) => renderSpyMessage(sm))
        .join('');
      uiNeedsRefresh = false;
    }

    window.requestAnimationFrame(render);
  }

  function receiveSpyMessage(): (
    this: WebSocket,
    ev: MessageEvent<any>
  ) => any {
    return ({ data }) => {
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (err) {
        console.error('Can not parse ' + data);
      }

      addSpyMessage(parsed);
    };
  }

  function openDetails(): (this: HTMLElement, ev: MouseEvent) => any {
    return (e) => {
      const row = (e.target as HTMLElement).closest('tr');
      const dataElements = row?.getElementsByClassName('data');
      const timeElements = row?.getElementsByClassName('time');
      const serviceKeyElements = row?.getElementsByClassName('serviceKey');

      if (
        !dataElements ||
        dataElements.length === 0 ||
        !timeElements ||
        timeElements.length === 0 ||
        !serviceKeyElements ||
        serviceKeyElements.length === 0
      ) {
        return;
      }

      modalTimeElement.innerHTML = timeElements[0].textContent || '';
      modalServiceKeyElement.innerHTML =
        serviceKeyElements[0].textContent || '';
      modalDataElement.innerHTML = formatDataJson(
        dataElements[0].textContent || ''
      );
      detailsModal.show();
    };
  }

  function formatDataJson(dataJson: string) {
    return formatHighlight(JSON.stringify(JSON.parse(dataJson), null, 2), {
      keyColor: 'black',
      numberColor: 'blue',
      stringColor: '#0B7500',
      trueColor: '#00cc00',
      falseColor: '#ff8080',
      nullColor: 'cornflowerblue',
    });
  }

  function addSpyMessage(spyMessage: SpyMessageExt) {
    const spyMessageExt = spyMessage as SpyMessageExt;
    spyMessageExt.dataJsonLowerCase = JSON.stringify(
      spyMessageExt.data
    ).toLocaleLowerCase();
    spyMessageExt.serviceKeyLowerCase =
      spyMessageExt.serviceKey.toLocaleLowerCase();

    const service = getServiceNameFromServiceKey(spyMessageExt.serviceKey);
    let spyMessageToAdd: SpyMessageExt | SpyMessageGroup | undefined =
      spyMessageExt;
    if (service === 'Function') {
      const spyMessageFunction =
        spyMessageExt as SpyMessageExt<FunctionBaseSpyEvent>;
      const awsRequestId = spyMessageFunction.data.context.awsRequestId;
      let functionEvents = functionEventsByRequestId[awsRequestId];
      if (!functionEvents) {
        functionEvents = [];
        functionEventsByRequestId[awsRequestId] = functionEvents;
      }

      const step = getFunctionStepFromServiceKey(spyMessageExt.serviceKey);
      if (step === 'Request') {
        spyMessageToAdd = <SpyMessageGroup>{
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: functionEvents,
          topic: spyMessageExt.topic,
        };
        functionEvents.unshift(spyMessageFunction);
      } else {
        addSpyMessageToArraySorted(spyMessageFunction, functionEvents);
        spyMessageToAdd = undefined;
      }
    } else if (service === 'SnsSubscription' || service === 'SnsTopic') {
      const spyMessageSns = spyMessageExt as SpyMessageExt<SnsSpyEventBase>;
      const messageId = spyMessageSns.data.messageId;
      let snsEvents = snsEventsByMessageId[messageId];
      if (!snsEvents) {
        snsEvents = [];
        snsEventsByMessageId[messageId] = snsEvents;
      }

      if (service === 'SnsTopic') {
        spyMessageToAdd = <SpyMessageGroup>{
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: snsEvents,
          topic: spyMessageExt.topic,
        };
        snsEvents.unshift(spyMessageSns);
      } else {
        addSpyMessageToArraySorted(spyMessageSns, snsEvents);
        spyMessageToAdd = undefined;
      }
    } else if (service === 'EventBridge' || service === 'EventBridgeRule') {
      const spyMessageEventBridge =
        spyMessageExt as SpyMessageExt<EventBridgeBaseSpyEvent>;
      const eventBridgeId = spyMessageEventBridge.data.eventBridgeId;
      let eventBridgeEvents = eventBridgeById[eventBridgeId];
      if (!eventBridgeEvents) {
        eventBridgeEvents = [];
        eventBridgeById[eventBridgeId] = eventBridgeEvents;
      }

      if (service === 'EventBridge') {
        spyMessageToAdd = <SpyMessageGroup>{
          timestamp: spyMessageExt.timestamp,
          serviceKey: spyMessageExt.serviceKey,
          messages: eventBridgeEvents,
          topic: spyMessageExt.topic,
        };
        eventBridgeEvents.unshift(spyMessageEventBridge);
      } else {
        addSpyMessageToArraySorted(spyMessageEventBridge, eventBridgeEvents);
        spyMessageToAdd = undefined;
      }
    }

    if (spyMessageToAdd) {
      //add in correct order
      addSpyMessageToArraySorted(spyMessageToAdd, spyMessages);
      uiNeedsRefresh = true;
    }
  }

  function matchFilter(
    spyMessage: SpyMessageExt,
    filter: {
      serviceKey: string;
      data: string;
    }
  ) {
    let testServiceKey = false;

    try {
      testServiceKey =
        !filter.serviceKey ||
        new RegExp(filter.serviceKey).test(spyMessage.serviceKeyLowerCase);
    } catch {}

    let testData = false;

    try {
      testData =
        !filter.data ||
        new RegExp(filter.data).test(spyMessage.dataJsonLowerCase);
    } catch {}

    return testServiceKey && testData;
  }

  function getFunctionStepFromServiceKey(serviceKey: string) {
    const serviceKeyParts = serviceKey.split('#');
    const step =
      serviceKeyParts.length > 0
        ? serviceKeyParts[serviceKeyParts.length - 1]
        : undefined;
    return step;
  }

  function renderSpyMessage(spyMessage: SpyMessageExt | SpyMessageGroup) {
    const serviceKey = serviceKeyFilterInputElement.value?.toLocaleLowerCase();
    const data = dataFilterInputElement.value?.toLocaleLowerCase();

    let messages: SpyMessageExt[];
    if ((spyMessage as SpyMessageGroup).messages) {
      messages = (spyMessage as SpyMessageGroup).messages;
    } else {
      messages = [spyMessage as SpyMessageExt];
    }
    const html = messages
      .filter((sm) => sm.topic === getTopic(selectedStack!))
      .filter((sm) => matchFilter(sm, { serviceKey, data }))
      .map((sm, i) => {
        const service = getServiceNameFromServiceKey(sm.serviceKey);
        let icon: string | undefined;

        let iconLinked = '<i class="icon-linked bi bi-arrow-return-right"></i>';

        switch (service) {
          case 'Function':
            const step = getFunctionStepFromServiceKey(sm.serviceKey);

            if (i === 0) {
              icon = `<img class="aws-icon" src="icons/Arch_AWS-Lambda_16.svg" ></img>`;
            } else {
              icon = iconLinked;
            }
            break;
          case 'S3':
            icon =
              '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Storage-Service_16.svg"/>';
            break;
          case 'SnsTopic':
            icon =
              '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Notification-Service_16.svg" />';
            break;
          case 'EventBridge':
            icon =
              '<img class="aws-icon" src="icons/Arch_Amazon-EventBridge_16.svg" />';
            break;
          case 'DynamoDB':
            icon =
              '<img class="aws-icon" src="icons/Arch_Amazon-DynamoDB_16.svg" />';
            break;
          case 'Sqs':
            icon =
              '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Queue-Service_16.svg" />';
            break;
          case 'EventBridgeRule':
            if (i === 0) {
              icon =
                '<img class="aws-icon" src="icons/Arch_Amazon-EventBridge_16.svg" />';
            } else {
              icon = iconLinked;
            }
            break;
          case 'SnsSubscription':
            if (i === 0) {
              icon =
                '<img class="aws-icon" src="icons/Arch_Amazon-Simple-Notification-Service_16.svg" />';
            } else {
              icon = iconLinked;
            }
            break;
          default:
            break;
        }
        let timeStamp;
        try {
          timeStamp = new Date(sm.timestamp).toISOString();
        } catch (e) {
          console.log(`Failed to render ${JSON.stringify(sm)}: ${e}`);
          throw e;
        }
        return `<tr>
    <td class="col-time"><span class="time">${timeStamp}</span></td>
    <td class="col-servicekey">${icon}<span class="serviceKey">${
          sm.serviceKey
        }</span></td>
    <td class="col-data"><div class="data">${JSON.stringify(
      sm.data
    )}</div></td></tr>
  
    `;
      })
      .join('');
    return html;
  }

  function getServiceNameFromServiceKey(serviceKey: string) {
    const serviceKeyParts = serviceKey.split('#');
    const service = serviceKeyParts.length > 0 ? serviceKeyParts[0] : undefined;
    return service;
  }

  function setupTooltip() {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );

    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }

  function addSpyMessageToArraySorted(
    spyMessageToAdd: SpyMessageExt | SpyMessageGroup,
    spyMessages: (SpyMessageExt | SpyMessageGroup)[]
  ) {
    // console.log('Adding message');
    let index = 0;
    for (let i = spyMessages.length - 1; i >= 0; i--) {
      const currentSpyMessages = spyMessages[i];
      index = i + 1;
      if (i === 0 || currentSpyMessages.timestamp < spyMessageToAdd.timestamp) {
        break;
      }
    }
    spyMessages.splice(index, 0, spyMessageToAdd);
  }
}

type SpyMessageExt<T extends SpyEvent = SpyEvent> = SpyMessage<T> & {
  dataJsonLowerCase: string;
  serviceKeyLowerCase: string;
  topic: string;
};

type SpyMessageGroup<T extends SpyEvent = SpyEvent> = {
  timestamp: string;
  serviceKey: string;
  messages: SpyMessageExt<T>[];
  topic: string;
};
