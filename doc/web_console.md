# Web console

The web console displays all events that ServerlessSpy intercepts in the environment. That is useful when developing to investigate what is happening in the system. The web console receives events via web socket and displays them in the table with a timestamp, event name (serviceKey), and data. You can filter events by serviceKey and data. You can use regular expressions.

If events are hierarchical like Lambda request & response, you can see an arrow from a parent from child events.
