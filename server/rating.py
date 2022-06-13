from typing import Tuple, List

from pydantic import BaseModel


class RateData(BaseModel):
    fname: str
    rate: float

class RateDataPair(BaseModel):
    datasetType: str
    win: RateData
    lose: RateData


def elo_rate( win_rate:float, lose_rate:float) -> Tuple[float,float]:
    E_win = 1.0 / (1.0 + 10.0**((lose_rate - win_rate)/400.0))
    E_lose = 1.0 / (1.0 + 10.0**((win_rate - lose_rate)/400.0))
    K = 32  
    new_win_rate = win_rate + K * (1 - E_win)
    new_lose_rate = lose_rate + K * (0 - E_lose)
    return (new_win_rate, new_lose_rate)

