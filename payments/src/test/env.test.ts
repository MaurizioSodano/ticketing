
it("use env variable for test", () => {
    console.log(process.env.TEST_ENV);
    expect(process.env.TEST_ENV).toEqual("TEST");
})