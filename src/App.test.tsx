import { render, screen, waitFor, cleanup } from "@testing-library/react";
import App from "./App";
import server from "./mocks/server";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { GET_PEOPLE_BY_NAME_URL } from "./constants";
import { PEOPLE_BY_NAME_MOCK } from "./mocks/peopleByNameMock";

afterEach(cleanup);

describe("Stars Wars App", () => {
  test("Renders correctly", () => {
    render(<App />);
    const input = screen.getByTestId("search-input");
    expect(input).toBeInTheDocument();
  });

  test("Should not search if whitespace only", async () => {
    const requestSpy = jest.fn();
    server.events.on("request:start", requestSpy);
    render(<App />);
    const input = screen.getByTestId("search-input");
    userEvent.type(input, " ");
    await waitFor(() => {
      expect(requestSpy).not.toHaveBeenCalled();
    });
  });

  test("Should render results if exits", async () => {
    server.use(
      rest.get(`${GET_PEOPLE_BY_NAME_URL}/Lu`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(PEOPLE_BY_NAME_MOCK));
      })
    );
    const requestSpy = jest.fn();
    server.events.on("request:start", requestSpy);
    render(<App />);
    userEvent.type(screen.getByTestId("search-input"), "Lu");
    await waitFor(
      () => {
        expect(screen.getByText(/loading .../i)).toBeInTheDocument();
      },
      {
        timeout: 2000,
      }
    );

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId("results-container")).toBeInTheDocument();
    });
  });

  test.skip("Should call the last input", async () => {
    server.use(
      rest.get(`${GET_PEOPLE_BY_NAME_URL}/Lu`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );
    const requestSpy = jest.fn();
    server.events.on("request:start", requestSpy);
    render(<App />);

    userEvent.type(screen.getByTestId("search-input"), "Lu");
    userEvent.type(screen.getByTestId("search-input"), "Luk");
    userEvent.type(screen.getByTestId("search-input"), "Luke");
    userEvent.type(screen.getByTestId("search-input"), "Luk");
    userEvent.type(screen.getByTestId("search-input"), "this does not exit");

    await waitFor(() => {
      expect(requestSpy).toHaveBeenCalledWith({
        query: "this does not exit",
      });
    });
  });
});
