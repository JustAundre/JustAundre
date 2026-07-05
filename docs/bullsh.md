# BullSH

> [!CAUTION]
> Security through obscurity is **not** as secure as it is fun to use.

> [!WARNING]
> The "Bullshit Shell" is an **Experimental** intermediary between SSHD and the system.

BullSH is a honeypot shell more commonly known as a "*Honeyshell*". BullSH is meant to confuse the person(s) behind the SSH sessions it intercepts.

## Dependencies

- `Python 3.0<=`
- `SSHD 4.4<=`

## Feature Set

> [!TIP]
> When attempting to **link Shellcam with BullSH**, *Ensure Shellcam leads into BullSH* rather than vice versa;
> This allows Shellcam to capture everything within a BullSH session.

- Replicates the [rBash shell](https://www.gnu.org/software/bash/manual/html_node/The-Restricted-Shell.html#The-Restricted-Shell-1) in its manner of errors
- Attempting to (re)assign **any** variable will yield a fake `readonly` error.
- Shell operators and unaccounted for builtins are not functional. <small>(See here for examples of ["shell operators"](https://www.tutorialspoint.com/unix/unix-basic-operators.htm))</small>
- Attempting to use `sudo` will initially attempt to authenticate using the real `sudo`, but will print a fake "*user is not in sudoers*" error anyway on success.
	- Can be linked with **Shellcam**. (Recommended)
- Prevents and logs non-interactive sessions
- Logs to a file, and JournalCTL/SystemD.
	- <small>File log is by default, configured to `/var/tmp/shell.log`. The tag (`-t`) for SystemD logs is `bullsh`.</small>
- Logs contain UID, EUID, input entered into BullSH (except successful authentications), failed attempts and layer count (all where applicable).
- Can be configured to fake root access, 

### Issues & Mitigations

> "Multiple instances of BullSH could be launched by 1 user to occupy system resources."

BullSH kills itself if it detects another instance by the same user is active.

> "Certain features of BullSH could be resource intensive even if only 1 instance is active."

BullSH has `ulimit`s set and safeguard around such features to prevent unreasonable spamming of such operations.

> "The file BullSH logs to is limited to a world-writable space because of its operation in the userland."

The issue is being worked on.

## The Passwords

Default Password(s):

Layer 1: `*hMyL0(o)r`

Layer 2: `DGE3TM3oOU`

Layer 3: `T.PLE@$3!?`

### Changing the Password(s)

To change the default password(s), first get the passwords you wish to change to, then hash them into [SHA-512](https://www.quora.com/How-does-SHA-512-work/) by the number of hashing rounds.

Go into `.bullshrc` & change the corresponding line in the `hashes` variable to your new hash(es).

## Roadmap/Notes

- There is room to add some fake success logic to redirect the attacker to a whole 'nother system entirely.