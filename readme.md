# PubSubTs

PubSub system written in TypeScript.

## Reference
Install via `yarn add pubsubts` or `npm install pubsubts`.

In your code:
```
import PubSub from 'pubsubts'
// also valid, but without TypeScript typings
const PubSub = require('pubsubts')
```

### PubSub.on(eventName: string, handler: Function): number
returns reference number, used for PubSub.off

### PubSub.once(eventName: string, handler: Function): number
Same as PubSub.once, except ref is removed (PubSub.off(ref)) after being called

### PubSub.off(eventName: string, ref?: number)
Removes specific handler. If ref not provided, removes all handlers for eventName.

### PubSub.emit(eventName: string, data: any)
Calls all registered handlers (with data if provided) for eventName