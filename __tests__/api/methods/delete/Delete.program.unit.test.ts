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
    deleteProgram,
    IProgramParms
} from "../../../../src";

describe("CMCI - Delete program", () => {

    const program = "program";
    const region = "region";
    const cicsPlex = "plex";
    const group = "group";
    const content = "This\nis\r\na\ntest";

    const deleteParms: IProgramParms = {
        regionName: region,
        name: program,
        csdGroup: group,
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
                response = await deleteProgram(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/Cannot read (property 'name' of undefined|properties of undefined \(reading 'name'\))/);
        });

        it("should throw error if program name is not defined", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: "fake",
                    csdGroup: "fake",
                    name: undefined,
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS program name is required");
        });

        it("should throw error if CSD group is not defined", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: "fake",
                    csdGroup: undefined,
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: undefined,
                    csdGroup: "fake",
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if program name is missing", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: "fake",
                    csdGroup: "fake",
                    name: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Program name' must not be blank");
        });

        it("should throw error if CSD group is missing", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: "fake",
                    csdGroup: "",
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD Group' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await deleteProgram(dummySession, {
                    regionName: "",
                    csdGroup: "fake",
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Region name' must not be blank");
        });
    });

    describe("success scenarios", () => {

        const deleteSpy = jest.spyOn(CicsCmciRestClient, "deleteExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            deleteSpy.mockClear();
            deleteSpy.mockImplementation(() => content);
        });

        it("should be able to delete a program without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteProgram(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to delete a program with cicsPlex specified but empty string", async () => {
            deleteParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "//" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteProgram(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to delete a program with cicsPlex specified", async () => {
            deleteParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + "/" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteProgram(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
