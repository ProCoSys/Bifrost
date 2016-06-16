describe("when getting data from a url using default parameters", sinon.test(function () {
    var url = "/Somewhere/With?query=value";
    var fakeServer = sinon.fakeServer.create();
    var data = { something: 42 };
    var requestUrl;

    $.support.cors = true;

    fakeServer.respondWith("GET", /\w/, function (xhr) {
        requestUrl = xhr.url;
        xhr.respond(200, { "Content-Type": "application/json" }, '{"somethingElse":"43"}');
    });

    var server = Bifrost.server.create();
    server.defaultParameters = { "default": "88", "other": "xx" };
    server.get(url, data);

    fakeServer.respond();

    it("should send the data as part of the body", function () {
        expect(requestUrl.indexOf("something=42") >= 0).toBe(true);
    });

    it("should send the first default parameter as part of the body", function () {
        expect(requestUrl.indexOf("default=88") >= 0).toBe(true);
    });

    it("should send the second default parameter as part of the body", function () {
        expect(requestUrl.indexOf("other=xx") >= 0).toBe(true);
    });
}));