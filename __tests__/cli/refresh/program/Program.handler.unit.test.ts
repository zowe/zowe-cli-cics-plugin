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

import { CommandProfiles, IHandlerParameters, IProfile, Session } from "@zowe/imperative";
import { ICMCIApiResponse } from "../../../../src";
import { ProgramDefinition } from "../../../../src/cli/refresh/program/Program.definition";
import ProgramHandler from "../../../../src/cli/refresh/program/Program.handler";

jest.mock("../../../../src/api/methods/set");
const Set = require("../../../../src/api/methods/set");

const host = "somewhere.com";
const port = "43443";
const user = "someone";
const password = "somesecret";
const protocol = "https";

const PROFILE_MAP = new Map<string, IProfile[]>();
PROFILE_MAP.set(
    "cics", [{
        name: "cics",
        type: "cics",
        host,
        port,
        user,
        password,
        protocol,
        rejectUnauthorized: false
    }]
);
const PROFILES: CommandProfiles = new CommandProfiles(PROFILE_MAP);
const DEFAULT_PARAMETERS: IHandlerParameters = {
    arguments: {$0: "", _: []}, // Please provide arguments later on
    response: {
        data: {
            setMessage: jest.fn((setMsgArgs) => {
                expect(setMsgArgs).toMatchSnapshot();
            }),
            setObj: jest.fn((setObjArgs) => {
                expect(setObjArgs).toMatchSnapshot();
            }),
            setExitCode: jest.fn()
        },
        console: {
            log: jest.fn((logs) => {
                expect(logs.toString()).toMatchSnapshot();
            }),
            error: jest.fn((errors) => {
                expect(errors.toString()).toMatchSnapshot();
            }),
            errorHeader: jest.fn(() => undefined)
        },
        progress: {
            startBar: jest.fn((parms) => undefined),
            endBar: jest.fn(() => undefined)
        },
        format: {
            output: jest.fn((parms) => {
                expect(parms).toMatchSnapshot();
            })
        }
    },
    definition: ProgramDefinition,
    fullDefinition: ProgramDefinition,
    profiles: PROFILES
};

describe("RefreshProgramHandler", () => {
    const programName = "testProgram";
    const regionName = "testRegion";
    const csdGroup = "testGroup";

    const defaultReturn: ICMCIApiResponse = {
        response: {
            resultsummary: {api_response1: "1024", api_response2: "0", recordcount: "0", displayed_recordcount: "0"},
            records: "testing"
        }
    };

    const functionSpy = jest.spyOn(Set, "programNewcopy");

    beforeEach(() => {
        functionSpy.mockClear();
        functionSpy.mockImplementation(async () => defaultReturn);
    });

    it("should call the programNewcopy api", async () => {
        const handler = new ProgramHandler();

        const commandParameters = {...DEFAULT_PARAMETERS};
        commandParameters.arguments = {
            ...commandParameters.arguments,
            programName,
            regionName,
            csdGroup,
            host,
            port,
            user,
            password,
            rejectUnauthorized: false
        };

        await handler.process(commandParameters);

        expect(functionSpy).toHaveBeenCalledTimes(1);
        const testProfile = PROFILE_MAP.get("cics")[0];
        expect(functionSpy).toHaveBeenCalledWith(
            new Session({
                type: "basic",
                hostname: testProfile.host,
                port: testProfile.port,
                user: testProfile.user,
                password: testProfile.password,
                rejectUnauthorized: false,
                protocol: "https",
            }),
            {
                name: programName,
                regionName
            }
        );
    });
});
