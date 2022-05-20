from pydantic import BaseModel


class RateData(BaseModel):
    fname: str
    rate: float

class RateDataPair(BaseModel):
    win: RateData
    lose: RateData
