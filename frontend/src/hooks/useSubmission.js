import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSubmission, listSubmissions, submitSubmission, triggerAiEvaluation } from "../services/submissionsApi";
import toast from "react-hot-toast";

export function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: listSubmissions,
    staleTime: 30 * 1000,
  });
}

export function useSubmission(id) {
  return useQuery({
    queryKey: ["submissions", id],
    queryFn: () => import("../services/submissionsApi").then((m) => m.request(`/submissions/${id}/`)),
    enabled: !!id,
  });
}

export function useCreateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Submission created!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useSubmitSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Submission finalized!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useTriggerAiEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerAiEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("AI evaluation complete");
    },
    onError: (err) => toast.error(err.message),
  });
}