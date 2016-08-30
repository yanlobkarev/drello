from django.shortcuts import render
from annoying.decorators import render_to


@render_to('board.html')
def board_index(request):
    return {}

