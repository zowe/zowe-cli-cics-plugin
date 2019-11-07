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

import { Session, listGroupWithOnlyProfileCommandSummary } from "@zowe/imperative";
import { CicsCmciRestClient, CicsCmciConstants, ICSDGroupParms, addCSDGroupToList } from "../../../../src";

describe("CMCI - Add csdGroup to list", () => {

    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const list = "list";
    const content = "This\nis\r\na\ntest";

    const addToListParms: ICSDGroupParms  = {
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
                response = await addCSDGroupToList(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Cannot read property 'name' of undefined");
        });

        it("should throw error if csdGroup name is not defined", async () => {
            try {
                response = await addCSDGroupToList(dummySession, {
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
                response = await addCSDGroupToList(dummySession, {
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
                response = await addCSDGroupToList(dummySession, {
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
                response = await addCSDGroupToList(dummySession, {
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
                response = await addCSDGroupToList(dummySession, {
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

        const requestBody: any = {
            request: {
                action: {
                    $: {
                        name: "CSDADD",
                    },
                    parameter: {
                        $: {
                            name: "TO_CSDLIST",
                            value: "list"
                        }
                    }
                }
            }
        };

        const defineSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            defineSpy.mockClear();
            defineSpy.mockImplementation(() => content);
        });

        it("should be able to add a csdGroup to list without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP + "/" + addToListParms.regionName +
            "?CRITERIA=NAME=='" + addToListParms.name + "'";

            response = await addCSDGroupToList(dummySession, addToListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to add a csdGroup to list with cicsPlex specified but empty string", async () => {
            addToListParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP + "/" + addToListParms.cicsPlex + "/" + addToListParms.regionName +
            "?CRITERIA=NAME=='" + addToListParms.name + "'";

            response = await addCSDGroupToList(dummySession, addToListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to add a csdGroup to list with cicsPlex specified", async () => {
            addToListParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
            CicsCmciConstants.CICS_CSDGROUP + "/" + addToListParms.cicsPlex + "/" + addToListParms.regionName +
            "?CRITERIA=NAME=='" + addToListParms.name + "'";

            response = await addCSDGroupToList(dummySession, addToListParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
