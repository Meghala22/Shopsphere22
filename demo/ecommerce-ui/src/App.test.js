import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: () => Promise.resolve([]),
    })
  );
});

test("renders the ecommerce workspace heading", async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText(/style marketplace/i)).toBeInTheDocument();
  });
});
