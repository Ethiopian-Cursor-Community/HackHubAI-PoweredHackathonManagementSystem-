from django.contrib import admin

from .models import Hackathon, HackathonJudge, HackathonParticipant

admin.site.register(Hackathon)
admin.site.register(HackathonParticipant)
admin.site.register(HackathonJudge)
