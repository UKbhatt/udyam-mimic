import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from "../src/components/navbar.jsx";

function setViewport(width) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

test('mobile menu toggles via hamburger', () => {
  setViewport(375); 
  render(<Navbar />);

  const button = screen.getByRole('button', { name: /toggle menu/i });
  // Collapsed menu uses max-h-0; expanded uses max-h-96; we can just check presence of items after click
  fireEvent.click(button);

  // After opening, one of the menu items should be visible
  expect(screen.getByText(/NIC Code/i)).toBeInTheDocument();

  // Close it
  fireEvent.click(button);
  // It should still be in DOM but hidden; safer assertion: not visible
  expect(screen.getByText(/NIC Code/i)).not.toBeVisible();
});

test('menu auto-closes when resized to desktop', () => {
  setViewport(375);
  render(<Navbar />);
  const button = screen.getByRole('button', { name: /toggle menu/i });

  fireEvent.click(button);
  expect(screen.getByText(/NIC Code/i)).toBeVisible();

  setViewport(1280); // triggers effect to close
  expect(screen.getByText(/NIC Code/i)).not.toBeVisible();
});
