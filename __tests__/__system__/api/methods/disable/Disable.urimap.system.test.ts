/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { Session } from "@zowe/imperative";
import { ITestEnvironment, TestEnvironment } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { defineUrimapServer, defineUrimapClient, defineUrimapPipeline, deleteUrimap, disableUrimap, IURIMapParms, discardUrimap,
    installUrimap, enableUrimap } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let session: Session;
let certificate: string;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 2000;

describe("CICS Disable URImap", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_disable_urimap",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const cicsProperties = testEnvironment.systemTestProperties.cics;
        certificate = testEnvironment.systemTestProperties.urimap.certificate;

        session = new Session({
            user: cicsProperties.user,
            password: cicsProperties.password,
            hostname: cicsProperties.host,
            port: cicsProperties.port,
            type: "basic",
            rejectUnauthorized: cicsProperties.rejectUnauthorized || false,
            protocol: cicsProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IURIMapParms = {} as any;

    it("should disable a URIMap of type server from CICS", async () => {
        let error;
        let response;

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.programName = "AAAA1234";
        options.csdGroup = csdGroup;
        options.regionName = regionName;
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";
        await defineUrimapServer(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);
        await enableUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await disableUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await discardUrimap(session, options);
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should disable a URIMap of type pipeline from CICS", async () => {
        let error;
        let response;

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.pipelineName = "AAAB1234";
        options.csdGroup = csdGroup;
        options.regionName = regionName;
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";
        await defineUrimapPipeline(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);
        await enableUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await disableUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await discardUrimap(session, options);
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should disable a URIMap of type client from CICS", async () => {
        let error;
        let response;

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.csdGroup = csdGroup;
        options.regionName = regionName;
        options.authenticate = "BASIC";
        options.certificate = certificate;
        options.tcpipservice = undefined;
        await defineUrimapClient(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);
        await enableUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await disableUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await discardUrimap(session, options);
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should fail to disable a URIMap to CICS with invalid CICS region", async () => {
        let error;
        let response;

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.csdGroup = csdGroup;
        options.regionName = "fake";
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";

        try {
            response = await disableUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to disable a URIMap that does not exist", async () => {
        let error;
        let response;

        const urimapName = "XXXXFAKE";

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.csdGroup = csdGroup;
        options.regionName = regionName;
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";

        try {
            response = await disableUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("NODATA");
    });
});
