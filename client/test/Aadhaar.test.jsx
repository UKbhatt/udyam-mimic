import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AadhaarCard from '../AadhaarCard';

const baseProps = {
  form: { aadhaar: '', name: '', consent: false },
  updateForm: jest.fn(),
  err: '',
  canSendOtp: true,
  aadhaarLocked: false,
  loading: false,
  step: 1,
  sendOtp: jest.fn((e) => e.preventDefault()),
};

test('shows Aadhaar error when 12 digits not met', async () => {
  const user = userEvent.setup();
  render(<AadhaarCard {...baseProps} />);

  const input = screen.getByPlaceholderText(/Your Aadhaar No/i);
  await user.type(input, '123'); 

  // If your component computes validity from props.form, you may need to rerender with new props.
  // Here we simulate rerender with invalid value to assert the message:
  const props2 = { ...baseProps, form: { ...baseProps.form, aadhaar: '123' } };
  render(<AadhaarCard {...props2} />);

  expect(screen.getByText(/Enter a valid 12-digit Aadhaar/i)).toBeInTheDocument();
});

test('submit calls sendOtp when valid and step=1', async () => {
  const user = userEvent.setup();
  const sendOtp = jest.fn((e) => e.preventDefault());
  const props = {
    ...baseProps,
    form: { aadhaar: '123456789012', name: 'Alice', consent: true },
    sendOtp,
  };
  render(<AadhaarCard {...props} />);

  await user.click(screen.getByRole('button', { name: /validate & generate otp/i }));
  expect(sendOtp).toHaveBeenCalled();
});
