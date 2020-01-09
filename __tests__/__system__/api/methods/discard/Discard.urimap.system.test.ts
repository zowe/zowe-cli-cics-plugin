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

import { Session, selectProfileNameDesc, createProfileOptionOverwriteDesc } from "@zowe/imperative";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { defineUrimapServer, defineUrimapClient, defineUrimapPipeline, deleteUrimap, IURIMapParms, discardUrimap, installUrimap, disableUrimap } from "../../../../../src";

let testEnvironment: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let session: Session;
let certificate: string;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 5000;

describe("CICS Discard URImap", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_discard_urimap",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const cmciProperties = await testEnvironment.systemTestProperties.cmci;
        certificate = testEnvironment.systemTestProperties.urimap.certificate;

        session = new Session({
            user: cmciProperties.user,
            password: cmciProperties.password,
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            type: "basic",
            rejectUnauthorized: cmciProperties.rejectUnauthorized || false,
            protocol: cmciProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IURIMapParms = {} as any;

    it("should discard a URIMap of type server from CICS", async () => {
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
        options.enable = false;
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";
        await defineUrimapServer(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await discardUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should discard a URIMap of type pipeline from CICS", async () => {
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
        options.enable = false;
        options.authenticate = undefined;
        options.certificate = undefined;
        options.tcpipservice = "TESTSVC";
        await defineUrimapPipeline(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await discardUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should discard a URIMap of type client from CICS", async () => {
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
        options.enable = false;
        options.authenticate = "BASIC";
        options.certificate = certificate;
        options.tcpipservice = undefined;
        await defineUrimapClient(session, options);
        await sleep(sleepTime);
        await installUrimap(session, options);
        await sleep(sleepTime);

        try {
            response = await discardUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should fail to discard a URIMap to CICS with invalid CICS region", async () => {
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
            response = await discardUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to discard a URIMap that does not exist", async () => {
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
            response = await discardUrimap(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("NODATA");
    });
});
