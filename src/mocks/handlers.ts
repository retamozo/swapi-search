import { rest } from "msw";
import { GET_PEOPLE_BY_NAME_URL } from "../constants";
import { PEOPLE_BY_NAME_MOCK } from "./peopleByNameMock";


function getPeopleByName() {
    return rest.get("https://swapi.dev/api/people/", (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(PEOPLE_BY_NAME_MOCK)
        )
    })
}

export const handlers = [getPeopleByName()]