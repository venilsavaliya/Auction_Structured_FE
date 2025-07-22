import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import colors from "../../Colors";

interface CountdownTimerProps {
  duration: number; // Duration in seconds
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert seconds to D:H:M:S
  const days = Math.floor(timeLeft / (60 * 60 * 24));
  const hours = Math.floor((timeLeft % (60 * 60 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const format = (num: number): string => String(num).padStart(2, "0");

  return (
    <Box
      component={motion.div}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      sx={{
        background: colors.primary,
        borderRadius: "16px",
        padding: "30px 40px",
        display: "flex",
        gap: "12px",
        boxShadow: "0 0 15px #00f2fe44",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {[
        { label: "Days", value: format(days) },
        { label: "Hours", value: format(hours) },
        { label: "Minutes", value: format(minutes) },
        { label: "Seconds", value: format(seconds) },
      ].map(({ label, value }) => (
        <Box
          key={label}
          sx={{
            textAlign: "center",
            background: "#161b22",
            padding: "10px 16px",
            borderRadius: "12px",
            boxShadow: "0 0 10px #00f2fe22",
            minWidth: "70px",
          }}
        >
          <Typography
            variant="h4"
            color={colors.lightBg}
            component={motion.div}
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            fontFamily="monospace"
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            color="gray"
            sx={{ fontSize: "12px", mt: 1 }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CountdownTimer;
