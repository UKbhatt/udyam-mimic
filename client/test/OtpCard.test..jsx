import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OtpCard from '../OtpCard';

test('accepts 6-digit OTP and calls verifyOtp', async () => {
  const user = userEvent.setup();
  const verifyOtp = jest.fn();

  render(
    <OtpCard
      step={2}
      loading={false}
      otp=""
      setOtp={jest.fn()}
      otpErr=""
      verifyOtp={verifyOtp}
    />
  );

  const input = screen.getByRole('textbox', { name: otp });
  await user.type(input, '123456');
  await user.click(screen.getByRole('button', { name: verify }));

  expect(verifyOtp).toHaveBeenCalled();
});
