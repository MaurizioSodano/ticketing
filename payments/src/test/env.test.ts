it("use env variable for test", () => {
    expect(process.env.TEST_ENV).toEqual("TEST");
})