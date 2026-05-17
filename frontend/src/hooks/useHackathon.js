import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHackathon,
  listHackathons,
  registerHackathon,
  publishHackathon,
  announceHackathon,
  publishResults,
} from "../services/hackathonsApi";
import toast from "react-hot-toast";

export function useHackathons() {
  return useQuery({
    queryKey: ["hackathons"],
    queryFn: listHackathons,
    staleTime: 30 * 1000,
  });
}

export function useHackathon(id) {
  const { data, ...rest } = useQuery({
    queryKey: ["hackathons", id],
    queryFn: () =>
      import("../services/hackathonsApi").then((m) =>
        m.request(`/hackathons/${id}/`)
      ),
    enabled: !!id,
  });
  return { hackathon: data, ...rest };
}

export function useCreateHackathon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHackathon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast.success("Hackathon created!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRegisterHackathon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerHackathon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast.success("Registered successfully");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function usePublishHackathon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishHackathon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast.success("Hackathon published!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useAnnounceHackathon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }) => announceHackathon(id, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast.success("Announcement sent!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function usePublishResults() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      toast.success("Results published!");
    },
    onError: (err) => toast.error(err.message),
  });
}