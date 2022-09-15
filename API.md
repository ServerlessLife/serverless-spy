# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### ServerlessSpy <a name="ServerlessSpy" id="serverless-spy.ServerlessSpy"></a>

#### Initializers <a name="Initializers" id="serverless-spy.ServerlessSpy.Initializer"></a>

```typescript
import { ServerlessSpy } from 'serverless-spy'

new ServerlessSpy(scope: Construct, id: string, props?: ServerlessSpyProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpy.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpy.Initializer.parameter.props">props</a></code> | <code><a href="#serverless-spy.ServerlessSpyProps">ServerlessSpyProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="serverless-spy.ServerlessSpy.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="serverless-spy.ServerlessSpy.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="serverless-spy.ServerlessSpy.Initializer.parameter.props"></a>

- *Type:* <a href="#serverless-spy.ServerlessSpyProps">ServerlessSpyProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#serverless-spy.ServerlessSpy.getConstructName">getConstructName</a></code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpy.spy">spy</a></code> | Initalize spying on resources. |
| <code><a href="#serverless-spy.ServerlessSpy.spyNodes">spyNodes</a></code> | Initalize spying on resources given as parameter. |

---

##### `toString` <a name="toString" id="serverless-spy.ServerlessSpy.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `getConstructName` <a name="getConstructName" id="serverless-spy.ServerlessSpy.getConstructName"></a>

```typescript
public getConstructName(construct: IConstruct): string
```

###### `construct`<sup>Required</sup> <a name="construct" id="serverless-spy.ServerlessSpy.getConstructName.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `spy` <a name="spy" id="serverless-spy.ServerlessSpy.spy"></a>

```typescript
public spy(filter?: SpyFilter): void
```

Initalize spying on resources.

###### `filter`<sup>Optional</sup> <a name="filter" id="serverless-spy.ServerlessSpy.spy.parameter.filter"></a>

- *Type:* <a href="#serverless-spy.SpyFilter">SpyFilter</a>

Limit which resources to spy on.

---

##### `spyNodes` <a name="spyNodes" id="serverless-spy.ServerlessSpy.spyNodes"></a>

```typescript
public spyNodes(nodes: IConstruct[]): void
```

Initalize spying on resources given as parameter.

###### `nodes`<sup>Required</sup> <a name="nodes" id="serverless-spy.ServerlessSpy.spyNodes.parameter.nodes"></a>

- *Type:* constructs.IConstruct[]

Which reources and their children to spy on.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="serverless-spy.ServerlessSpy.isConstruct"></a>

```typescript
import { ServerlessSpy } from 'serverless-spy'

ServerlessSpy.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="serverless-spy.ServerlessSpy.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#serverless-spy.ServerlessSpy.property.serviceKeys">serviceKeys</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpy.property.wsUrl">wsUrl</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="serverless-spy.ServerlessSpy.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `serviceKeys`<sup>Required</sup> <a name="serviceKeys" id="serverless-spy.ServerlessSpy.property.serviceKeys"></a>

```typescript
public readonly serviceKeys: string[];
```

- *Type:* string[]

---

##### `wsUrl`<sup>Required</sup> <a name="wsUrl" id="serverless-spy.ServerlessSpy.property.wsUrl"></a>

```typescript
public readonly wsUrl: string;
```

- *Type:* string

---


## Structs <a name="Structs" id="Structs"></a>

### ServerlessSpyProps <a name="ServerlessSpyProps" id="serverless-spy.ServerlessSpyProps"></a>

#### Initializer <a name="Initializer" id="serverless-spy.ServerlessSpyProps.Initializer"></a>

```typescript
import { ServerlessSpyProps } from 'serverless-spy'

const serverlessSpyProps: ServerlessSpyProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#serverless-spy.ServerlessSpyProps.property.debugMode">debugMode</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpyProps.property.generateSpyEventsFileLocation">generateSpyEventsFileLocation</a></code> | <code>string</code> | *No description.* |

---

##### `debugMode`<sup>Optional</sup> <a name="debugMode" id="serverless-spy.ServerlessSpyProps.property.debugMode"></a>

```typescript
public readonly debugMode: boolean;
```

- *Type:* boolean

---

##### `generateSpyEventsFileLocation`<sup>Optional</sup> <a name="generateSpyEventsFileLocation" id="serverless-spy.ServerlessSpyProps.property.generateSpyEventsFileLocation"></a>

```typescript
public readonly generateSpyEventsFileLocation: string;
```

- *Type:* string

---

### SpyFilter <a name="SpyFilter" id="serverless-spy.SpyFilter"></a>

#### Initializer <a name="Initializer" id="serverless-spy.SpyFilter.Initializer"></a>

```typescript
import { SpyFilter } from 'serverless-spy'

const spyFilter: SpyFilter = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#serverless-spy.SpyFilter.property.spyDynamoDB">spyDynamoDB</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spyEventBridge">spyEventBridge</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spyEventBridgeRule">spyEventBridgeRule</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spyLambda">spyLambda</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spyS3">spyS3</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spySnsSubsription">spySnsSubsription</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spySnsTopic">spySnsTopic</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#serverless-spy.SpyFilter.property.spySqs">spySqs</a></code> | <code>boolean</code> | *No description.* |

---

##### `spyDynamoDB`<sup>Optional</sup> <a name="spyDynamoDB" id="serverless-spy.SpyFilter.property.spyDynamoDB"></a>

```typescript
public readonly spyDynamoDB: boolean;
```

- *Type:* boolean

---

##### `spyEventBridge`<sup>Optional</sup> <a name="spyEventBridge" id="serverless-spy.SpyFilter.property.spyEventBridge"></a>

```typescript
public readonly spyEventBridge: boolean;
```

- *Type:* boolean

---

##### `spyEventBridgeRule`<sup>Optional</sup> <a name="spyEventBridgeRule" id="serverless-spy.SpyFilter.property.spyEventBridgeRule"></a>

```typescript
public readonly spyEventBridgeRule: boolean;
```

- *Type:* boolean

---

##### `spyLambda`<sup>Optional</sup> <a name="spyLambda" id="serverless-spy.SpyFilter.property.spyLambda"></a>

```typescript
public readonly spyLambda: boolean;
```

- *Type:* boolean

---

##### `spyS3`<sup>Optional</sup> <a name="spyS3" id="serverless-spy.SpyFilter.property.spyS3"></a>

```typescript
public readonly spyS3: boolean;
```

- *Type:* boolean

---

##### `spySnsSubsription`<sup>Optional</sup> <a name="spySnsSubsription" id="serverless-spy.SpyFilter.property.spySnsSubsription"></a>

```typescript
public readonly spySnsSubsription: boolean;
```

- *Type:* boolean

---

##### `spySnsTopic`<sup>Optional</sup> <a name="spySnsTopic" id="serverless-spy.SpyFilter.property.spySnsTopic"></a>

```typescript
public readonly spySnsTopic: boolean;
```

- *Type:* boolean

---

##### `spySqs`<sup>Optional</sup> <a name="spySqs" id="serverless-spy.SpyFilter.property.spySqs"></a>

```typescript
public readonly spySqs: boolean;
```

- *Type:* boolean

---



