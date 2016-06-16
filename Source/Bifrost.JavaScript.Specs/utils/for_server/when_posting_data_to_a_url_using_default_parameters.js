describe("when posting data to a url using default parameters", sinon.test(function () {
    var url = "/Somewhere/With?query=value";
    var fakeServer = sinon.fakeServer.create();
    var data = { something: 42 };
    var requestBody;

    $.support.cors = true;

    fakeServer.respondWith("POST", /\w/, function (xhr) {
        requestBody = xhr.requestBody;
        xhr.respond(200, { "Content-Type":"application/json" }, '{"somethingElse":"43"}');
    });

    var server = Bifrost.server.create();
    server.defaultParameters = { "default": "88", "other": "xx" };

    server.post(url, data);
    fakeServer.respond();

    it("should send the data and the default parameter as part of the body", function () {
        expect(requestBody).toEqual('{"default":"88","other":"xx","something":"42"}');
    });
}));