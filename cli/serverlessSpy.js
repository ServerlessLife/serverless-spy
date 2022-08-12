function run() {
  const tableBody = document.getElementById("tableBody");
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  const modalContent = document.getElementById("modalContent");
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  tableBody.addEventListener("click", function (e) {
    const dataJson = JSON.stringify(
      JSON.parse(e.target.parentElement.children[2].textContent),
      null,
      2
    );
    modalContent.innerText = dataJson;
    modal.style.display = "block";
    //alert();
  });

  const url = "SERVERLESS_SPY_WS_URL";
  //"wss://m6g3w6ttdh.execute-api.eu-west-1.amazonaws.com/prod?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJGMEQCIDk%2BzQd0RC2DmEgCJEPoRFAkmnhCZl%2BSIlEG4TummRkIAiBIgNG8Yw%2FOAew3XNAE3yrNCK0G0q%2BZI8MwjEa8xoEonirrAQgbEAQaDDA3NjU4NTk2NzA3NSIMxVUxKhwdqGjFOsRtKsgB2eotQMFgl4CrD8uy%2Fe1UE6K4HVc6uWo0gdjgHMPb5C9Mq0wFgHTiDFjFxIFkJpmCiTRXKqNFrx5lpo9C5Ml1bpcv%2BTopT6wvpbFksxChhhnaqUDHiBaGuys8zEy8Bjlu4jF0nKccmUYdieD70%2FXz99OU4wKPxXyWbr0w82y1Xd6ag8g4VNx3EXEdULq7vkM6H2shSAH8EUlZoTD%2BqvIQvyKS8nta3ebhprO%2BsLRQv2YC6k1w46jHuOjtI7hSnmfSKnkUqAxS6g4wgZrFlwY6mQFNSXz7jSF3IRtdcpMEIp%2Bnghf2LhvZKeW6GkZs4DMeuhPjoBehfmXLJIJWgcvLoheQvIt28ddgHU60%2BoRKhZTxQKhpvSOaAbI6M%2B%2FyHvkC2hTR4fEBtESAMnzo8WocfxdaQQ0YVYq2m5NKSXs3QrrsYIIirkFYhB%2BjAwG8bqBAuE9SQNeIthHjT27hB7KUeIIoXtwSVGutv70%3D&X-Amz-Date=20220808T175057Z&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIARDVHBDXR4QCRLL4O%2F20220808%2Feu-west-1%2Fexecute-api%2Faws4_request&X-Amz-SignedHeaders=host&X-Amz-Signature=d58ab2b792a69f20f8e3bf9bf4fb19c8ec8f271bd1b594f8cd25c02d4c85521d";
  const ws = new WebSocket(url);

  ws.addEventListener("open", function (event) {
    console.log("connected " + new Date().toISOString());
  });

  ws.addEventListener("message", function ({ data }) {
    //debugger;
    //console.log(`From server: ${data}`);

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (err) {
      console.error("Can not parse " + data);
    }

    addLog(parsed);

    // if (parsed) {
    //   console.log(
    //     `\x1b[47m\x1b[34m${parsed.timestamp} \x1b[31m🍕 ${
    //       parsed.serviceKey
    //     }\x1b[0m\x1b[32m\n${JSON.stringify(parsed.data, null, 2)}\x1b[0m`
    //   );
    // }
  });
  ws.addEventListener("close", function () {
    console.log("disconnected " + new Date().toISOString());
  });

  function addLog(data) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${new Date(data.timestamp).toLocaleTimeString()}</td>
    <td>${data.serviceKey}</td>
    <td>${JSON.stringify(data.data)}</td>
    `;
    tableBody.append(newRow);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("RUN");
  run();
});
