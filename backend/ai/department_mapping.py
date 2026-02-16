

def map_to_department(complaint_type: str) -> str:
    mapping = {
        "Illegal Parking": "Traffic Department",
        "Blocked Driveway": "Traffic Department",
        "Traffic": "Traffic Department",

        "Noise - Street/Sidewalk": "Police Department",
        "Noise - Vehicle": "Police Department",
        "Noise - Commercial": "Police Department",
        "Noise - Park": "Police Department",
        "Noise - House of Worship": "Police Department",
        "Disorderly Youth": "Police Department",
        "Drinking": "Police Department",

        "Animal Abuse": "Animal Control Department",

        "Graffiti": "Municipality Department",
        "Posting Advertisement": "Municipality Department",
        "Derelict Vehicle": "Municipality Department",
        "Vending": "Municipality Department",

        "Agency Issues": "General Administration"
    }

    return mapping.get(complaint_type, "General Administration")
