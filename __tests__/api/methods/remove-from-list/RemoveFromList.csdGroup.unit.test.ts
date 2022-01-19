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
import { CicsCmciRestClient, CicsCmciConstants, ICSDGroupParms, removeCSDGroupFromList } from "../../../../src";

describe("CMCI - Remove csdGroup from list", () => {

    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const list = "list";
    const content = "This\nis\r\na\ntest";

    const removeFromListParms: ICSDGroupParms  = {
        regionName: region,
        name: group,
        csdList: list,
        cicsPlex: undefined
    };

    const dummySession = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        port: 1490
    });

    let error: any;
    let response: any;
    let endPoint: string;

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
        });

        it("should throw error if no parms are defined", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/(cannot read).*undefined/ig);
        });

        it("should throw error if csdGroup name is not defined", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, {
                    regionName: "fake",
                    name: undefined,
                    csdList: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD Group Name is required");
        });

        it("should throw error if CSD List is not defined", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdList: undefined
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD List is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, {
                    regionName: undefined,
                    name: "fake",
                    csdList: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if csdGroup name is missing", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, {
                    regionName: "fake",
                    name: "",
                    csdList: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD Group Name' must not be blank");
        });

        it("should throw error if CSD List is missing", async () => {
            try {
                response = await removeCSDGroupFromList(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdList: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD List' must not be blank");
        });
    });
    describe("success scenarios", () => {

        const defineSpy = jest.spyOn(CicsCmciRestClient, "deleteExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            defineSpy.mockClear();
            defineSpy.mockImplementation(() => content);
        });

        it("should be able to remove a csdGroup from list without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP_IN_LIST + "/" + removeFromListParms.regionName +
            "?CRITERIA=(CSDLIST=='" + removeFromListParms.csdList + "')%20AND%20(CSDGROUP=='" + removeFromListParms.name + "')";

            response = await removeCSDGroupFromList(dummySession, removeFromListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to remove a csdGroup from list with cicsPlex specified but empty string", async () => {
            removeFromListParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP_IN_LIST + "/" + removeFromListParms.cicsPlex + "/" + removeFromListParms.regionName +
            "?CRITERIA=(CSDLIST=='" + removeFromListParms.csdList + "')%20AND%20(CSDGROUP=='" + removeFromListParms.name + "')";

            response = await removeCSDGroupFromList(dummySession, removeFromListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to remove a csdGroup from list with cicsPlex specified", async () => {
            removeFromListParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP_IN_LIST + "/" + removeFromListParms.cicsPlex + "/" + removeFromListParms.regionName +
            "?CRITERIA=(CSDLIST=='" + removeFromListParms.csdList + "')%20AND%20(CSDGROUP=='" + removeFromListParms.name + "')";

            response = await removeCSDGroupFromList(dummySession, removeFromListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
