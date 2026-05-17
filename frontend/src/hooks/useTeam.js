import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, listTeams } from "../services/teamsApi";
import toast from "react-hot-toast";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: listTeams,
    staleTime: 30 * 1000,
  });
}

export function useTeam(id) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => import("../services/teamsApi").then((m) => m.request(`/teams/${id}/`)),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team created!");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }) =>
      import("../services/teamsApi").then((m) => m.request(`/teams/${teamId}/invite/`, { method: "POST", body: JSON.stringify({ invited_user: userId }) })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Invitation sent");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRequestJoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId) =>
      import("../services/teamsApi").then((m) => m.request(`/teams/${teamId}/request/`, { method: "POST" })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Join request sent");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useResolveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, requestId, decision }) =>
      import("../services/teamsApi").then((m) =>
        m.request(`/teams/${teamId}/requests/${requestId}/`, {
          method: "PATCH",
          body: JSON.stringify({ decision }),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Request resolved");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useResolveInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteId, decision }) =>
      import("../services/teamsApi").then((m) =>
        m.request(`/teams/invitations/${inviteId}/`, {
          method: "PATCH",
          body: JSON.stringify({ decision }),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Invitation resolved");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, userId }) =>
      import("../services/teamsApi").then((m) =>
        m.request(`/teams/${teamId}/members/${userId}/`, { method: "DELETE" })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Member removed");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teamId) =>
      import("../services/teamsApi").then((m) =>
        m.request(`/teams/${teamId}/leave/`, { method: "DELETE" })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Left team");
    },
    onError: (err) => toast.error(err.message),
  });
}