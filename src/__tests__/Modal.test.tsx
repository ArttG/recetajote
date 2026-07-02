import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "@/components/shared/Modal";

// Mock framer-motion që animacionet të mos ndikojnë në teste.
jest.mock("framer-motion", () => ({
  motion: { div: (props: React.ComponentProps<"div">) => <div {...props} /> },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("Modal", () => {
  it("nuk shfaqet kur open=false", () => {
    render(<Modal open={false} title="Test" onClose={jest.fn()}>Përmbajtje</Modal>);
    expect(screen.queryByText("Përmbajtje")).not.toBeInTheDocument();
  });

  it("shfaq titullin dhe përmbajtjen kur open=true", () => {
    render(<Modal open title="Konfirmo" onClose={jest.fn()}>A je i sigurt?</Modal>);
    expect(screen.getByText("Konfirmo")).toBeInTheDocument();
    expect(screen.getByText("A je i sigurt?")).toBeInTheDocument();
  });

  it("thërret onClose kur klikohet butoni i mbylljes", () => {
    const onClose = jest.fn();
    render(<Modal open title="Test" onClose={onClose}>Përmbajtje</Modal>);
    fireEvent.click(screen.getByLabelText("Mbyll"));
    expect(onClose).toHaveBeenCalled();
  });
});
