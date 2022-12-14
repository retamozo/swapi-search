import { GET_PEOPLE_BY_NAME_URL } from "../constants";
import { SearchPeopleByQueryResult } from "../types/persons";


type Params = {
    input: string;
    controller: AbortController;
};

type GetPersonByName = (params: Params) => Promise<SearchPeopleByQueryResult>;

export const getPersonByName: GetPersonByName = async ({
    input = "Luk",
    controller,
}) => {
    try {
        const req = await fetch(`${GET_PEOPLE_BY_NAME_URL}${input}`, {
            signal: controller.signal
        });
        const res = await req?.json();
        return res;
    } catch (e) {
        controller.abort()
        console.error("oh no", e);
    }
};
