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
import {
    CicsCmciConstants,
    CicsCmciRestClient,
    ICMCIApiResponse,
    IWebServiceParms,
    deleteWebservice
} from "../../../../src";

describe("CMCI - Delete web service", () => {

    const webservice = "webservice";
    const region = "region";
    const group = "group";
    const content = "ThisIsATest" as unknown as ICMCIApiResponse;

    const deleteParms: IWebServiceParms = {
        regionName: region,
        name: webservice,
        csdGroup: group
    };

    const dummySession = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        port: 1490
    });

    let error: any;
    let response: any;
    let endPoint: any;

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
            deleteParms.regionName = region;
            deleteParms.name = webservice;
            deleteParms.csdGroup = group;
        });

        it("should throw an error if no region name is specified", async () => {
            deleteParms.regionName = undefined;
            try {
                response = await deleteWebservice(dummySession, deleteParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw an error if no web service name is specified", async () => {
            deleteParms.name = undefined;
            try {
                response = await deleteWebservice(dummySession, deleteParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS Web service name is required");
        });

        it("should throw an error if no csdgroup is specified", async () => {
            deleteParms.csdGroup = undefined;
            try {
                response = await deleteWebservice(dummySession, deleteParms);
            } catch (err) {
                error = err;
            }
            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group is required");
        });
    });

    describe("success scenarios", () => {
        const deleteSpy = jest.spyOn(CicsCmciRestClient, "deleteExpectParsedXml").mockResolvedValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            deleteSpy.mockClear();
            deleteSpy.mockResolvedValue(content);
            deleteParms.regionName = region;
            deleteParms.name = webservice;
            deleteParms.csdGroup = group;
        });

        it("should be able to delete a web service", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_DEFINITION_WEBSERVICE + "/" + region +
            `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteWebservice(dummySession, deleteParms);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
