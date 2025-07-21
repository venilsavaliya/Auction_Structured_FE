import React, { useEffect } from "react";
import { Box, TextField, Typography, Button, FormLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { scoreSchema } from "../../../Schemas/ScoreSchema";
// import axios from "../../../api/axios";
import { buttonStyle } from "../../../ComponentStyles";
import { toast } from "react-toastify";
import scoringService from "../../../Services/ScoringService/ScoringService";

interface ScoreFormInputs {
  Run: number;
  Four: number;
  Six: number;
  HalfCentury: number;
  Century: number;
  Duck: number;
  Wicket: number;
  ThreeWicketHaul: number;
  FourWicketHaul: number;
  FiveWicketHaul: number;
  MaidenOver: number;
  Catch: number;
  ThreeCatchHaul: number;
  Stumping: number;
  DirectRunOut: number;
  AssistedRunOut: number;
}

const DEFAULT_VALUES: ScoreFormInputs = {
  Run: 0,
  Four: 0,
  Six: 0,
  HalfCentury: 0,
  Century: 0,
  Duck: 0,
  Wicket: 0,
  ThreeWicketHaul: 0,
  FourWicketHaul: 0,
  FiveWicketHaul: 0,
  MaidenOver: 0,
  Catch: 0,
  ThreeCatchHaul: 0,
  Stumping: 0,
  DirectRunOut: 0,
  AssistedRunOut: 0,
};

const ScorePage: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ScoreFormInputs>({
    resolver: yupResolver(scoreSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const fetchScoringRules = async () => {
    try {
      //   const res = await axios.get("/scoringrule/all");
      const res = await scoringService.GetScoringRules();
      const rules: { eventType: string; points: number }[] = res.data;

      rules.forEach((r) =>
        setValue(r.eventType as keyof ScoreFormInputs, r.points)
      );
    } catch {
      toast.error("Failed to load scoring rules");
    }
  };

  useEffect(() => {
    fetchScoringRules();
  }, []);

  const handleResetChange = () => {
    fetchScoringRules();
  };

  const onSubmit = async (data: ScoreFormInputs) => {
    const payload = Object.entries(data).map(([eventType, points]) => ({
      eventType,
      points,
    }));
    try {
    //   await axios.put("/scoringrule", payload);
    await scoringService.UpdateScoringRules(payload);
      fetchScoringRules();
      toast.success("Changes Saved Successfully");
    } catch {
      toast.error("Failed to save changes");
    }
  };

  const renderField = (label: string, name: keyof ScoreFormInputs) => (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      justifyContent="space-between"
    >
      <FormLabel>{label}</FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            variant="filled"
            error={!!errors[name]}
            helperText={errors[name]?.message}
            sx={{ width: "200px" }}
          />
        )}
      />
    </Box>
  );

  return (
    <>
      <Typography variant="h4" mb={4}>
        Score Configuration
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={4}
          justifyContent="space-evenly"
        >
          <Box width="350px" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" mt={4}>
              Batting Points
            </Typography>
            {renderField("Run", "Run")}
            {renderField("Four", "Four")}
            {renderField("Six", "Six")}
            {renderField("Half Century", "HalfCentury")}
            {renderField("Century", "Century")}
            {renderField("Duck", "Duck")}
          </Box>
          <Box width="350px" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" mt={4}>
              Bowling Points
            </Typography>
            {renderField("Wicket", "Wicket")}
            {renderField("3 Wicket Haul", "ThreeWicketHaul")}
            {renderField("4 Wicket Haul", "FourWicketHaul")}
            {renderField("5 Wicket Haul", "FiveWicketHaul")}
            {renderField("Maiden Over", "MaidenOver")}
          </Box>
          <Box width="350px" display="flex" flexDirection="column" gap={2}>
            <Typography variant="h5" mt={4}>
              Fielding Points
            </Typography>
            {renderField("Catch", "Catch")}
            {renderField("3 Catch", "ThreeCatchHaul")}
            {renderField("Stumping", "Stumping")}
            {renderField("Direct Run Out", "DirectRunOut")}
            {renderField("Assisted Run Out", "AssistedRunOut")}
          </Box>
        </Box>
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={buttonStyle}
          >
            Save Scoring Rules
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetChange}
            sx={buttonStyle}
          >
            Reset Points
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ScorePage;
