const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/routers/math');

test('should calculate tip', () => {
    const tip = calculateTip(10, .3);
    expect(tip).toBe(3);
})

test('should calculate total with default tip', () => {
    const x = 5;
    const tip = calculateTip(x);
    expect(tip).toBe(.25*x);
})

test('Should convert 32 F to 0 C', () => {
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0);
})

test('Should convert 0 C to 32 F', () => {
    const temp = celsiusToFahrenheit(0);
    expect(temp).toBe(32);
})

test('async demo', (done) => {
    add(2, 3).then((sum) => {
        expect(sum).toBe(5);
        done();
    })
})

test('async/await demo', async() => {
    const sum = await add(4, 5);
    expect(sum).toBe(9);
})
