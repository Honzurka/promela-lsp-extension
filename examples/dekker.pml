bool flags[2];
bool turn;
bool work[2];

inline entry(i) {
    flags[i] = 1;
    do
    :: (flags[1-i] == 1) ->
	do // turn == i would block until its true
	:: (turn != i) -> flags[i] = 0;
	:: (turn == i) -> flags[i] = 1; break;
	od
    :: (flags[1-i] == 0) -> break
    od
}

inline exit(i) {
    turn = 1 - i;
    flags[i] = 0;
}

proctype process(bool i) {
    entry(i);

    printf("Process %d is in critical section\n", i);
    work[i] = 1;
    assert(work[0] + work[1] <= 1) //could be checked inside monitor() active
    work[i] = 0;

    exit(i);

    //check starvation: add done++ --- ??????
}

init {
    flags[0] = 0;
    flags[1] = 0;
    turn = 0;
    run process(0);
    run process(1);
}

