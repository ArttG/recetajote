import { render, screen, fireEvent } from "@testing-library/react";
import Button from "@/components/shared/Button";

describe("Button", () => {
  it("shfaq tekstin e dhënë", () => {
    render(<Button text="Kliko Këtu" />);
    expect(screen.getByText("Kliko Këtu")).toBeInTheDocument();
  });

  it("thërret onClick kur klikohet", () => {
    const handleClick = jest.fn();
    render(<Button text="Ruaj" onClick={handleClick} />);
    fireEvent.click(screen.getByText("Ruaj"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("është i çaktivizuar kur disabled=true", () => {
    render(<Button text="Dërgo" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
