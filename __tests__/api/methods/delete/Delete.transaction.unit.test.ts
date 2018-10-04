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

import { Session } from "@brightside/imperative";
import {
    CicsCmciConstants,
    CicsCmciRestClient,
    deleteTransaction, installTransaction,
    ITransactionParms
} from "../../../../src";

describe("CMCI - Discard transaction", () => {

    const transaction = "transaction";
    const program = "program";
    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const deleteParms: ITransactionParms  = {
        regionName: region,
        name: transaction,
        programName: program,
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
                response = await deleteTransaction(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Cannot read property 'name' of undefined");
        });

        it("should throw error if transaction name is not defined", async () => {
            try {
                response = await deleteTransaction(dummySession, {
                    regionName: "fake",
                    programName: "fake",
                    csdGroup: "fake",
                    name: undefined,
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS transaction name is required");
        });

        it("should throw error if CSD group is not defined", async () => {
            try {
                response = await deleteTransaction(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdGroup: undefined
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
                response = await deleteTransaction(dummySession, {
                    regionName: undefined,
                    name: "fake",
                    programName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if transaction name is missing", async () => {
            try {
                response = await deleteTransaction(dummySession, {
                    regionName: "fake",
                    name: "",
                    programName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Transaction name' must not be blank");
        });

        it("should throw error if CSD group is missing", async () => {
            try {
                response = await deleteTransaction(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdGroup: ""
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
                response = await deleteTransaction(dummySession, {
                    regionName: "",
                    name: "fake",
                    programName: "fake",
                    csdGroup: "fake"
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

        it("should be able to delete a transaction without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteTransaction(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to delete a transaction with cicsPlex specified but empty string", async () => {
            deleteParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "//" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteTransaction(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to delete a transaction with cicsPlex specified", async () => {
            deleteParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_TRANSACTION + "/" + cicsPlex + "/" + region +
                `?CRITERIA=(NAME=${deleteParms.name})&PARAMETER=CSDGROUP(${deleteParms.csdGroup})`;

            response = await deleteTransaction(dummySession, deleteParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
