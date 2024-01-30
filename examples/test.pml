chan ToC = [2] of {byte};
chan ToP = [2] of {mtype, byte};
int myint = 1;

active proctype Producer() {
    byte val = 0;
    byte capacity = 2;
    

    do
    :: (capacity > 0 && val < 10) -> ToC ! val; val++; capacity--;
    :: (capacity < 2) -> ToP ? 123(_); capacity++;
    :: else -> break;
    od
    
    assert(capacity == 2);
}

// active proctype Consumer() {
//     byte expectedVal = 0;
//     byte receivedVal;
//     do
// 	:: (expectedVal < 10) ->
// 	    ToC ? receivedVal;
// 	    assert(receivedVal == expectedVal);
// 	    expectedVal++;
// 	    ToP ! 123(receivedVal); //val added for debugging
// 	:: else -> break
//     od

//     assert(expectedVal == 10)
// }

