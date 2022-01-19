# C#

This program is a bootstrap you will have to hack to earn points !

## Install

You need to have installed:

- [.NET 6.0](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)

## Setup

To make it work, you have to change properties in [`appsettings.json`](./ElephantCarpaccioClient/appsettings.json) as:

- `Settings:Host`: IP provided by your workshop leader
- `Settings:Team`: your own name, team name or anything that can identify you. Be careful, if you have the same name as someone else in this workshop, your connection will be refused.

## How can I start the server ?

```sh
cd client-csharp
dotnet restore
dotnet run --project ElephantCarpaccioClient
```

:warning: If it works, stop here until your workshop leader presses the "start" button. When the timer has started, you can code.

## What should I do to earn points ?

To parse a cart properly, you have to change the `computeInvoice` method in [`Cart.cs`](./ElephantCarpaccioClient/Cart.cs) and return the correct invoice value.

To know what rules you will have to create, ask your team leader.
