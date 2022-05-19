from typing import Tuple, List


__INIT_RATE = 1500
__IMAGE_LIST = [
    "0.jpg", "1.jpg", "2.jpg",
    "3.jpg", "4.jpg", "5.jpg",
    "6.jpg", "7.jpg", "8.jpg", "9.jpg" ]


def _get_init_datas( image_list:List[str] ):
    init_datas = {}
    for fname in image_list:
        data = {
            "rate": __INIT_RATE,
            "win": 0,
            "lose": 0
        }
        init_datas[ "images/" + fname ] = data
    return init_datas


def get_global_init_datas():
    return _get_init_datas( __IMAGE_LIST )


def elo_rate( win_rate:float, lose_rate:float) -> Tuple[float,float]:
    E_win = 1.0/( 1.0 + 10.0**(( lose_rate - win_rate)/400.0) )
    E_lose = 1.0/( 1.0 + 10.0**(( win_rate - lose_rate)/400.0) )
    K = 32    
    new_win_rate = win_rate + K * (1 - E_win)
    new_lose_rate = lose_rate + K * (0 - E_lose)
    return (new_win_rate, new_lose_rate)

