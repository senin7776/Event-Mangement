import React, { useState, useEffect } from 'react';
import { useEventContext } from '@/contexts/EventContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  phone: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ phone, onVerified, onBack }) => {
  const { state, dispatch } = useEventContext();
  const { toast } = useToast();
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: 'VERIFY_OTP', payload: { code: otp } });
    
    if (state.otp.isVerified || otp === state.otp.code) {
      onVerified();
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendOTP = () => {
    dispatch({ type: 'GENERATE_OTP', payload: { phone } });
    setTimeLeft(300);
    setOtp('');
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${phone}. (Code: ${state.otp.code})`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="shadow-elegant animate-bounce-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 gradient-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
            <p className="text-muted-foreground">
              We've sent a 4-digit code to <br />
              <strong>{phone}</strong>
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mock OTP Display (for demo purposes) */}
            <div className="bg-accent/50 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Demo Code (normally sent via SMS):</p>
              <p className="text-2xl font-bold text-primary">{state.otp.code}</p>
            </div>

            <div>
              <Input
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <Button 
              onClick={handleVerifyOTP}
              className="w-full gradient-primary"
              disabled={!otp || otp.length !== 4}
            >
              Verify OTP
            </Button>

            <div className="text-center space-y-3">
              {timeLeft > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in {formatTime(timeLeft)}
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResendOTP}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend OTP
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Phone Number
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerification;