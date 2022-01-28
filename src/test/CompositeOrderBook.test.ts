import { CompositeOrderBook, Side } from '../CompositeOrderBook'

test('adding price levels for same exchange at same price creates one level and updates it', () => {
    const orderbook = new CompositeOrderBook('BTC/USD')

    orderbook.updateLevel('A',Side.Sell,100,10)
    let l2 = orderbook.getAsks()
    expect(l2.length).toBe(1)
    expect(l2[0].size).toBe(10)

    orderbook.updateLevel('A',Side.Sell,100,20)
    l2 = orderbook.getAsks()
    expect(l2.length).toBe(1)
    expect(l2[0].size).toBe(20)
});

test('adding price levels for two exchanges at same price creates two separate levels', () => {
    const orderbook = new CompositeOrderBook('BTC/USD')

    orderbook.updateLevel('A',Side.Sell,100,10)
    let l2 = orderbook.getAsks()
    expect(l2.length).toBe(1)
    expect(l2[0].size).toBe(10)

    orderbook.updateLevel('B',Side.Sell,100,10)
    l2 = orderbook.getAsks()
    expect(l2.length).toBe(2)
    expect(l2[0].exchange).toBe('A')
    expect(l2[1].exchange).toBe('B')
});

test('matching against two exchanges at two price levels gives three executions', () => {
    const orderbook = new CompositeOrderBook('BTC/USD')

    orderbook.updateLevel('A',Side.Sell,100,10)
    orderbook.updateLevel('B',Side.Sell,100,20)
    orderbook.updateLevel('A',Side.Sell,101,20)

    const execs = orderbook.newOrder(Side.Buy, 35)

    expect(execs.length).toBe(3)

    expect(execs[0].exchange).toBe('A')
    expect(execs[0].lastPrice).toBe(100)
    expect(execs[0].lastQty).toBe(10)

    expect(execs[1].exchange).toBe('B')
    expect(execs[1].lastPrice).toBe(100)
    expect(execs[1].lastQty).toBe(20)

    expect(execs[2].exchange).toBe('A')
    expect(execs[2].lastPrice).toBe(101)
    expect(execs[2].lastQty).toBe(5)

});