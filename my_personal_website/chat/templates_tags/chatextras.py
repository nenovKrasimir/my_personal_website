from django import template

register = template.Library()


@register.filter(name='initials')
def initials(value):

    if len(value) >= 2:
        initials = value[0]+value[1]
    else:
        initials = value
    # for name in value.split(' '):
    #     if name and len(initials) < 3:
    #         initials += name[0].upper()

    return initials.upper()
