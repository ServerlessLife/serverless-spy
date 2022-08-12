# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### ServerlessSpy <a name="ServerlessSpy" id="serverless-spy.ServerlessSpy"></a>

#### Initializers <a name="Initializers" id="serverless-spy.ServerlessSpy.Initializer"></a>

```typescript
import { ServerlessSpy } from 'serverless-spy'

new ServerlessSpy(scope: Construct, id: string)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#serverless-spy.ServerlessSpy.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="serverless-spy.ServerlessSpy.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="serverless-spy.ServerlessSpy.Initializer.parameter.id"></a>

- *Type:* string

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#serverless-spy.ServerlessSpy.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#serverless-spy.ServerlessSpy.getConstructName">getConstructName</a></code> | *No description.* |

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
| <code><a href="#serverless-spy.ServerlessSpy.property.wsUrl">wsUrl</a></code> | <code>string</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="serverless-spy.ServerlessSpy.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `wsUrl`<sup>Required</sup> <a name="wsUrl" id="serverless-spy.ServerlessSpy.property.wsUrl"></a>

```typescript
public readonly wsUrl: string;
```

- *Type:* string

---





