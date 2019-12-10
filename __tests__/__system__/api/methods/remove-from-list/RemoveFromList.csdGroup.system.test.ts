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
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { addCSDGroupToList, removeCSDGroupFromList, ICSDGroupParms } from "../../../../../src";

let testEnvironment: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let csdList: string;
let session: Session;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 4000;

describe("CICS RemoveFromList csdGroup", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_remove-from-list_csd-group",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const listNameSuffixLength = 4;
        const cmciProperties = await testEnvironment.systemTestProperties.cmci;
        csdList = "AAAA" + generateRandomAlphaNumericString(listNameSuffixLength);

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

    const options: ICSDGroupParms = {} as any;

    it("should remove a csdGroup from a list in CICS", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = regionName;

        await addCSDGroupToList(session, options);
        await sleep(sleepTime);

        try {
            response = await removeCSDGroupFromList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
    });

    it("should fail to remove a csdGroup frp, a list in CICS with invalid CICS region", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = "FAKE";

        try {
            response = await removeCSDGroupFromList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to remove a csdGroup from a list in CICS that does not contain the csdGroup", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = regionName;

        try {
            response = await removeCSDGroupFromList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("NODATA");
    });
});
