import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { Transaction } from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
export var getErrorForTransaction = function() {
    var _ref = _async_to_generator(function(connection, txid) {
        var tx, errors;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // wait for all confirmation before geting transaction
                    return [
                        4,
                        connection.confirmTransaction(txid, "max")
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        connection.getParsedConfirmedTransaction(txid)
                    ];
                case 2:
                    tx = _state.sent();
                    errors = [];
                    if ((tx === null || tx === void 0 ? void 0 : tx.meta) && tx.meta.logMessages) {
                        tx.meta.logMessages.forEach(function(log) {
                            var regex = /Error: (.*)/gm;
                            var m;
                            while((m = regex.exec(log)) !== null){
                                // This is necessary to avoid infinite loops with zero-width matches
                                if (m.index === regex.lastIndex) {
                                    regex.lastIndex++;
                                }
                                if (m.length > 1) {
                                    errors.push(m[1]);
                                }
                            }
                        });
                    }
                    return [
                        2,
                        errors
                    ];
            }
        });
    });
    return function getErrorForTransaction(connection, txid) {
        return _ref.apply(this, arguments);
    };
}();
export var SequenceType;
(function(SequenceType) {
    SequenceType[SequenceType["Sequential"] = 0] = "Sequential";
    SequenceType[SequenceType["Parallel"] = 1] = "Parallel";
    SequenceType[SequenceType["StopOnFailure"] = 2] = "StopOnFailure";
})(SequenceType || (SequenceType = {}));
export function sendTransactionsWithManualRetry(connection, wallet, instructions, signers) {
    return _sendTransactionsWithManualRetry.apply(this, arguments);
}
function _sendTransactionsWithManualRetry() {
    _sendTransactionsWithManualRetry = _async_to_generator(function(connection, wallet, instructions, signers) {
        var stopPoint, tries, lastInstructionsLength, toRemoveSigners, _tmp, ids, filteredSigners, id, txs, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    stopPoint = 0;
                    tries = 0;
                    lastInstructionsLength = null;
                    _tmp = {};
                    toRemoveSigners = _tmp;
                    instructions = instructions.filter(function(instr, i) {
                        if (instr.length > 0) {
                            return true;
                        } else {
                            toRemoveSigners[i] = true;
                            return false;
                        }
                    });
                    ids = [];
                    filteredSigners = signers.filter(function(_, i) {
                        return !toRemoveSigners[i];
                    });
                    _state.label = 1;
                case 1:
                    if (!(stopPoint < instructions.length && tries < 3)) return [
                        3,
                        9
                    ];
                    instructions = instructions.slice(stopPoint, instructions.length);
                    filteredSigners = filteredSigners.slice(stopPoint, filteredSigners.length);
                    if (instructions.length === lastInstructionsLength) tries = tries + 1;
                    else tries = 0;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        ,
                        8
                    ]);
                    if (!(instructions.length === 1)) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        sendTransactionWithRetry(connection, wallet, instructions[0], filteredSigners[0], "single")
                    ];
                case 3:
                    id = _state.sent();
                    ids.push(id.txid);
                    stopPoint = 1;
                    return [
                        3,
                        6
                    ];
                case 4:
                    return [
                        4,
                        sendTransactions(connection, wallet, instructions, filteredSigners, SequenceType.StopOnFailure, "single")
                    ];
                case 5:
                    txs = _state.sent().txs;
                    ids = ids.concat(txs.map(function(t) {
                        return t.txid;
                    }));
                    _state.label = 6;
                case 6:
                    return [
                        3,
                        8
                    ];
                case 7:
                    e = _state.sent();
                    console.error(e);
                    return [
                        3,
                        8
                    ];
                case 8:
                    console.log("Died on ", stopPoint, "retrying from instruction", instructions[stopPoint], "instructions length is", instructions.length);
                    lastInstructionsLength = instructions.length;
                    return [
                        3,
                        1
                    ];
                case 9:
                    return [
                        2,
                        ids
                    ];
            }
        });
    });
    return _sendTransactionsWithManualRetry.apply(this, arguments);
}
export var sendTransactions = function() {
    var _ref = _async_to_generator(function(connection, wallet, instructionSet, signersSet) {
        var _loop, sequenceType, commitment, successCallback, failCallback, block, beforeTransactions, afterTransactions, _unsignedTxns, unsignedTxns, i, partiallySignedTransactions, fullySignedTransactions, signedTxns, pendingTxns, i1, signedTxnPromise, _tmp, e, _tmp1, result, _tmp2, _tmp3;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _loop = function(i) {
                        var _transaction;
                        var instructions = instructionSet[i];
                        var signers = signersSet[i];
                        if (instructions.length === 0) {
                            return "continue";
                        }
                        var transaction = new Transaction();
                        instructions.forEach(function(instruction) {
                            return transaction.add(instruction);
                        });
                        transaction.recentBlockhash = block.blockhash;
                        (_transaction = transaction).setSigners.apply(_transaction, [
                            // fee payed by the wallet owner
                            wallet.publicKey
                        ].concat(_to_consumable_array(signers.map(function(s) {
                            return s.publicKey;
                        }))));
                        if (signers.length > 0) {
                            var _transaction1;
                            (_transaction1 = transaction).partialSign.apply(_transaction1, _to_consumable_array(signers));
                        }
                        unsignedTxns.push(transaction);
                    };
                    sequenceType = _arguments.length > 4 && _arguments[4] !== void 0 ? _arguments[4] : SequenceType.Parallel, commitment = _arguments.length > 5 && _arguments[5] !== void 0 ? _arguments[5] : "singleGossip", successCallback = _arguments.length > 6 && _arguments[6] !== void 0 ? _arguments[6] : function(txid, ind) {}, failCallback = _arguments.length > 7 && _arguments[7] !== void 0 ? _arguments[7] : function(txid, ind) {
                        return false;
                    }, block = _arguments.length > 8 ? _arguments[8] : void 0, beforeTransactions = _arguments.length > 9 && _arguments[9] !== void 0 ? _arguments[9] : [], afterTransactions = _arguments.length > 10 && _arguments[10] !== void 0 ? _arguments[10] : [];
                    if (!wallet.publicKey) throw new WalletNotConnectedError();
                    unsignedTxns = beforeTransactions;
                    if (!!block) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        connection.getRecentBlockhash(commitment)
                    ];
                case 1:
                    block = _state.sent();
                    _state.label = 2;
                case 2:
                    for(i = 0; i < instructionSet.length; i++)_loop(i);
                    (_unsignedTxns = unsignedTxns).push.apply(_unsignedTxns, _to_consumable_array(afterTransactions));
                    partiallySignedTransactions = unsignedTxns.filter(function(t) {
                        return t.signatures.find(function(sig) {
                            return sig.publicKey.equals(wallet.publicKey);
                        });
                    });
                    fullySignedTransactions = unsignedTxns.filter(function(t) {
                        return !t.signatures.find(function(sig) {
                            return sig.publicKey.equals(wallet.publicKey);
                        });
                    });
                    return [
                        4,
                        wallet.signAllTransactions(partiallySignedTransactions)
                    ];
                case 3:
                    signedTxns = _state.sent();
                    signedTxns = fullySignedTransactions.concat(signedTxns);
                    pendingTxns = [];
                    console.log("Signed txns length", signedTxns.length, "vs handed in length", instructionSet.length);
                    i1 = 0;
                    _state.label = 4;
                case 4:
                    if (!(i1 < signedTxns.length)) return [
                        3,
                        13
                    ];
                    _tmp = {};
                    signedTxnPromise = sendSignedTransaction((_tmp.connection = connection, _tmp.signedTransaction = signedTxns[i1], _tmp));
                    if (!(sequenceType !== SequenceType.Parallel)) return [
                        3,
                        11
                    ];
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        7,
                        ,
                        10
                    ]);
                    return [
                        4,
                        signedTxnPromise.then(function(param) {
                            var txid = param.txid, slot = param.slot;
                            return successCallback(txid, i1);
                        })
                    ];
                case 6:
                    _state.sent();
                    pendingTxns.push(signedTxnPromise);
                    return [
                        3,
                        10
                    ];
                case 7:
                    e = _state.sent();
                    console.log("Failed at txn index:", i1);
                    console.log("Caught failure:", e);
                    failCallback(signedTxns[i1], i1);
                    if (!(sequenceType === SequenceType.StopOnFailure)) return [
                        3,
                        9
                    ];
                    _tmp1 = {
                        number: i1
                    };
                    return [
                        4,
                        Promise.all(pendingTxns)
                    ];
                case 8:
                    return [
                        2,
                        (_tmp1.txs = _state.sent(), _tmp1)
                    ];
                case 9:
                    return [
                        3,
                        10
                    ];
                case 10:
                    return [
                        3,
                        12
                    ];
                case 11:
                    pendingTxns.push(signedTxnPromise);
                    _state.label = 12;
                case 12:
                    i1++;
                    return [
                        3,
                        4
                    ];
                case 13:
                    if (!(sequenceType !== SequenceType.Parallel)) return [
                        3,
                        15
                    ];
                    return [
                        4,
                        Promise.all(pendingTxns)
                    ];
                case 14:
                    result = _state.sent();
                    _tmp2 = {};
                    return [
                        2,
                        (_tmp2.number = signedTxns.length, _tmp2.txs = result, _tmp2)
                    ];
                case 15:
                    _tmp3 = {
                        number: signedTxns.length
                    };
                    return [
                        4,
                        Promise.all(pendingTxns)
                    ];
                case 16:
                    return [
                        2,
                        (_tmp3.txs = _state.sent(), _tmp3)
                    ];
            }
        });
    });
    return function sendTransactions(connection, wallet, instructionSet, signersSet) {
        return _ref.apply(this, arguments);
    };
}();
export var sendTransaction = function() {
    var _ref = _async_to_generator(function(connection, wallet, instructions, signers) {
        var awaitConfirmation, commitment, includesFeePayer, block, transaction, _tmp, _transaction, _transaction1, _transaction2, rawTransaction, options, _tmp1, txid, slot, confirmation, errors, _tmp2;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    awaitConfirmation = _arguments.length > 4 && _arguments[4] !== void 0 ? _arguments[4] : true, commitment = _arguments.length > 5 && _arguments[5] !== void 0 ? _arguments[5] : "singleGossip", includesFeePayer = _arguments.length > 6 && _arguments[6] !== void 0 ? _arguments[6] : false, block = _arguments.length > 7 ? _arguments[7] : void 0;
                    if (!wallet.publicKey) throw new WalletNotConnectedError();
                    if (!_instanceof(instructions, Transaction)) return [
                        3,
                        1
                    ];
                    transaction = instructions;
                    return [
                        3,
                        5
                    ];
                case 1:
                    transaction = new Transaction();
                    instructions.forEach(function(instruction) {
                        return transaction.add(instruction);
                    });
                    _tmp = block;
                    if (_tmp) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        connection.getRecentBlockhash(commitment)
                    ];
                case 2:
                    _tmp = _state.sent();
                    _state.label = 3;
                case 3:
                    transaction.recentBlockhash = _tmp.blockhash;
                    if (includesFeePayer) {
                        ;
                        (_transaction = transaction).setSigners.apply(_transaction, _to_consumable_array(signers.map(function(s) {
                            return s.publicKey;
                        })));
                    } else {
                        ;
                        (_transaction1 = transaction).setSigners.apply(_transaction1, [
                            // fee payed by the wallet owner
                            wallet.publicKey
                        ].concat(_to_consumable_array(signers.map(function(s) {
                            return s.publicKey;
                        }))));
                    }
                    if (signers.length > 0) {
                        ;
                        (_transaction2 = transaction).partialSign.apply(_transaction2, _to_consumable_array(signers));
                    }
                    if (!!includesFeePayer) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        wallet.signTransaction(transaction)
                    ];
                case 4:
                    transaction = _state.sent();
                    _state.label = 5;
                case 5:
                    rawTransaction = transaction.serialize();
                    _tmp1 = {};
                    options = (_tmp1.skipPreflight = true, _tmp1.commitment = commitment, _tmp1);
                    return [
                        4,
                        connection.sendRawTransaction(rawTransaction, options)
                    ];
                case 6:
                    txid = _state.sent();
                    slot = 0;
                    if (!awaitConfirmation) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        awaitTransactionSignatureConfirmation(txid, DEFAULT_TIMEOUT, connection, commitment)
                    ];
                case 7:
                    confirmation = _state.sent();
                    if (!confirmation) throw new Error("Timed out awaiting confirmation on transaction");
                    slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
                    if (!(confirmation === null || confirmation === void 0 ? void 0 : confirmation.err)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        getErrorForTransaction(connection, txid)
                    ];
                case 8:
                    errors = _state.sent();
                    console.log(errors);
                    throw new Error("Raw transaction ".concat(txid, " failed"));
                case 9:
                    _tmp2 = {};
                    return [
                        2,
                        (_tmp2.txid = txid, _tmp2.slot = slot, _tmp2)
                    ];
            }
        });
    });
    return function sendTransaction(connection, wallet, instructions, signers) {
        return _ref.apply(this, arguments);
    };
}();
export var sendTransactionWithRetry = function() {
    var _ref = _async_to_generator(function(connection, wallet, instructions, signers) {
        var commitment, includesFeePayer, block, beforeSend, transaction, _tmp, _transaction, _transaction1, _transaction2, ref, txid, slot, _tmp1, _tmp2;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    commitment = _arguments.length > 4 && _arguments[4] !== void 0 ? _arguments[4] : "singleGossip", includesFeePayer = _arguments.length > 5 && _arguments[5] !== void 0 ? _arguments[5] : false, block = _arguments.length > 6 ? _arguments[6] : void 0, beforeSend = _arguments.length > 7 ? _arguments[7] : void 0;
                    if (!wallet.publicKey) throw new WalletNotConnectedError();
                    transaction = new Transaction();
                    instructions.forEach(function(instruction) {
                        return transaction.add(instruction);
                    });
                    _tmp = block;
                    if (_tmp) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        connection.getRecentBlockhash(commitment)
                    ];
                case 1:
                    _tmp = _state.sent();
                    _state.label = 2;
                case 2:
                    transaction.recentBlockhash = _tmp.blockhash;
                    if (includesFeePayer) {
                        ;
                        (_transaction = transaction).setSigners.apply(_transaction, _to_consumable_array(signers.map(function(s) {
                            return s.publicKey;
                        })));
                    } else {
                        ;
                        (_transaction1 = transaction).setSigners.apply(_transaction1, [
                            // fee payed by the wallet owner
                            wallet.publicKey
                        ].concat(_to_consumable_array(signers.map(function(s) {
                            return s.publicKey;
                        }))));
                    }
                    if (signers.length > 0) {
                        ;
                        (_transaction2 = transaction).partialSign.apply(_transaction2, _to_consumable_array(signers));
                    }
                    if (!!includesFeePayer) return [
                        3,
                        4
                    ];
                    return [
                        4,
                        wallet.signTransaction(transaction)
                    ];
                case 3:
                    transaction = _state.sent();
                    _state.label = 4;
                case 4:
                    if (beforeSend) {
                        beforeSend();
                    }
                    _tmp1 = {};
                    return [
                        4,
                        sendSignedTransaction((_tmp1.connection = connection, _tmp1.signedTransaction = transaction, _tmp1))
                    ];
                case 5:
                    ref = _state.sent(), txid = ref.txid, slot = ref.slot;
                    _tmp2 = {};
                    return [
                        2,
                        (_tmp2.txid = txid, _tmp2.slot = slot, _tmp2)
                    ];
            }
        });
    });
    return function sendTransactionWithRetry(connection, wallet, instructions, signers) {
        return _ref.apply(this, arguments);
    };
}();
export var getUnixTs = function() {
    return new Date().getTime() / 1000;
};
var DEFAULT_TIMEOUT = 15000;
export function sendSignedTransaction(_) {
    return _sendSignedTransaction.apply(this, arguments);
}
function _sendSignedTransaction() {
    _sendSignedTransaction = _async_to_generator(function(param) {
        var signedTransaction, connection, _timeout, timeout, rawTransaction, startTime, slot, txid, _tmp, done, confirmation, err, simulateResult, e, i, line, _tmp1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    signedTransaction = param.signedTransaction, connection = param.connection, _timeout = param.timeout, timeout = _timeout === void 0 ? DEFAULT_TIMEOUT : _timeout;
                    rawTransaction = signedTransaction.serialize();
                    startTime = getUnixTs();
                    slot = 0;
                    _tmp = {};
                    return [
                        4,
                        connection.sendRawTransaction(rawTransaction, (_tmp.skipPreflight = true, _tmp))
                    ];
                case 1:
                    txid = _state.sent();
                    console.log("Started awaiting confirmation for", txid);
                    done = false;
                    _async_to_generator(function() {
                        var _tmp;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    if (!(!done && getUnixTs() - startTime < timeout)) return [
                                        3,
                                        2
                                    ];
                                    _tmp = {};
                                    connection.sendRawTransaction(rawTransaction, (_tmp.skipPreflight = true, _tmp));
                                    return [
                                        4,
                                        sleep(500)
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        3,
                                        0
                                    ];
                                case 2:
                                    return [
                                        2
                                    ];
                            }
                        });
                    })();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        9,
                        10
                    ]);
                    return [
                        4,
                        awaitTransactionSignatureConfirmation(txid, timeout, connection, "recent", true)
                    ];
                case 3:
                    confirmation = _state.sent();
                    if (!confirmation) throw new Error("Timed out awaiting confirmation on transaction");
                    if (confirmation.err) {
                        console.error(confirmation.err);
                        throw new Error("Transaction failed: Custom instruction error");
                    }
                    slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
                    return [
                        3,
                        10
                    ];
                case 4:
                    err = _state.sent();
                    console.error("Timeout Error caught", err);
                    if (err.timeout) {
                        throw new Error("Timed out awaiting confirmation on transaction");
                    }
                    simulateResult = null;
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        7,
                        ,
                        8
                    ]);
                    return [
                        4,
                        simulateTransaction(connection, signedTransaction, "single")
                    ];
                case 6:
                    simulateResult = _state.sent().value;
                    return [
                        3,
                        8
                    ];
                case 7:
                    e = _state.sent();
                    return [
                        3,
                        8
                    ];
                case 8:
                    if (simulateResult && simulateResult.err) {
                        if (simulateResult.logs) {
                            for(i = simulateResult.logs.length - 1; i >= 0; --i){
                                line = simulateResult.logs[i];
                                if (line.startsWith("Program log: ")) {
                                    throw new Error("Transaction failed: " + line.slice("Program log: ".length));
                                }
                            }
                        }
                        throw new Error(JSON.stringify(simulateResult.err));
                    }
                    return [
                        3,
                        10
                    ];
                case 9:
                    done = true;
                    return [
                        7
                    ];
                case 10:
                    console.log("Latency", txid, getUnixTs() - startTime);
                    _tmp1 = {};
                    return [
                        2,
                        (_tmp1.txid = txid, _tmp1.slot = slot, _tmp1)
                    ];
            }
        });
    });
    return _sendSignedTransaction.apply(this, arguments);
}
function simulateTransaction(connection, transaction, commitment) {
    return _simulateTransaction.apply(this, arguments);
}
function _simulateTransaction() {
    _simulateTransaction = _async_to_generator(function(connection, transaction, commitment) {
        var signData, wireTransaction, encodedTransaction, config, _tmp, args, res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        connection._recentBlockhash(// @ts-ignore
                        connection._disableBlockhashCaching)
                    ];
                case 1:
                    // @ts-ignore
                    transaction.recentBlockhash = _state.sent();
                    signData = transaction.serializeMessage();
                    wireTransaction = transaction._serialize(signData);
                    encodedTransaction = wireTransaction.toString("base64");
                    _tmp = {};
                    config = (_tmp.encoding = "base64", _tmp.commitment = commitment, _tmp);
                    args = [
                        encodedTransaction,
                        config
                    ];
                    return [
                        4,
                        connection._rpcRequest("simulateTransaction", args)
                    ];
                case 2:
                    res = _state.sent();
                    if (res.error) {
                        throw new Error("failed to simulate transaction: " + res.error.message);
                    }
                    return [
                        2,
                        res.result
                    ];
            }
        });
    });
    return _simulateTransaction.apply(this, arguments);
}
function awaitTransactionSignatureConfirmation(txid, timeout, connection) {
    return _awaitTransactionSignatureConfirmation.apply(this, arguments);
}
function _awaitTransactionSignatureConfirmation() {
    _awaitTransactionSignatureConfirmation = _async_to_generator(function(txid, timeout, connection) {
        var commitment, queryStatus, done, status, _tmp, subId;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    commitment = _arguments.length > 3 && _arguments[3] !== void 0 ? _arguments[3] : "recent", queryStatus = _arguments.length > 4 && _arguments[4] !== void 0 ? _arguments[4] : false;
                    done = false;
                    _tmp = {};
                    status = (_tmp.slot = 0, _tmp.confirmations = 0, _tmp.err = null, _tmp);
                    subId = 0;
                    return [
                        4,
                        new Promise(function() {
                            var _ref = _async_to_generator(function(resolve, reject) {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            setTimeout(function() {
                                                if (done) {
                                                    return;
                                                }
                                                done = true;
                                                console.log("Rejecting for timeout...");
                                                reject({
                                                    timeout: true
                                                });
                                            }, timeout);
                                            try {
                                                subId = connection.onSignature(txid, function(result, context) {
                                                    done = true;
                                                    status = {
                                                        err: result.err,
                                                        slot: context.slot,
                                                        confirmations: 0
                                                    };
                                                    if (result.err) {
                                                        console.log("Rejected via websocket", result.err);
                                                        reject(status);
                                                    } else {
                                                        console.log("Resolved via websocket", result);
                                                        resolve(status);
                                                    }
                                                }, commitment);
                                            } catch (e) {
                                                done = true;
                                                console.error("WS error in setup", txid, e);
                                            }
                                            _state.label = 1;
                                        case 1:
                                            if (!(!done && queryStatus)) return [
                                                3,
                                                3
                                            ];
                                            // eslint-disable-next-line no-loop-func
                                            _async_to_generator(function() {
                                                var signatureStatuses, e;
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            _state.trys.push([
                                                                0,
                                                                2,
                                                                ,
                                                                3
                                                            ]);
                                                            return [
                                                                4,
                                                                connection.getSignatureStatuses([
                                                                    txid
                                                                ])
                                                            ];
                                                        case 1:
                                                            signatureStatuses = _state.sent();
                                                            status = signatureStatuses && signatureStatuses.value[0];
                                                            if (!done) {
                                                                if (!status) {
                                                                    console.log("REST null result for", txid, status);
                                                                } else if (status.err) {
                                                                    console.log("REST error for", txid, status);
                                                                    done = true;
                                                                    reject(status.err);
                                                                } else if (!status.confirmations) {
                                                                    console.log("REST no confirmations for", txid, status);
                                                                } else {
                                                                    console.log("REST confirmation for", txid, status);
                                                                    done = true;
                                                                    resolve(status);
                                                                }
                                                            }
                                                            return [
                                                                3,
                                                                3
                                                            ];
                                                        case 2:
                                                            e = _state.sent();
                                                            if (!done) {
                                                                console.log("REST connection error: txid", txid, e);
                                                            }
                                                            return [
                                                                3,
                                                                3
                                                            ];
                                                        case 3:
                                                            return [
                                                                2
                                                            ];
                                                    }
                                                });
                                            })();
                                            return [
                                                4,
                                                sleep(2000)
                                            ];
                                        case 2:
                                            _state.sent();
                                            return [
                                                3,
                                                1
                                            ];
                                        case 3:
                                            return [
                                                2
                                            ];
                                    }
                                });
                            });
                            return function(resolve, reject) {
                                return _ref.apply(this, arguments);
                            };
                        }())
                    ];
                case 1:
                    status = _state.sent();
                    //@ts-ignore
                    if (connection._signatureSubscriptions[subId]) connection.removeSignatureListener(subId);
                    done = true;
                    console.log("Returning status", status);
                    return [
                        2,
                        status
                    ];
            }
        });
    });
    return _awaitTransactionSignatureConfirmation.apply(this, arguments);
}
export function sleep(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}
