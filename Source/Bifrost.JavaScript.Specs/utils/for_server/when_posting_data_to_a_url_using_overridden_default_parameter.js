describe("when posting data to a url using overridden default parameter", sinon.test(function () {
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
    server.defaultParameters = { something: 88 };

    server.post(url, data);
    fakeServer.respond();

    it("should send only the data as part of the body", function () {
        expect(requestBody).toEqual('{"something":"42"}');
    });
}));