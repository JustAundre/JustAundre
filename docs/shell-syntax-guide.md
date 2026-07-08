# A Shell Syntax Guide

> [!IMPORTANT]
>
> This guide relies on an understanding of general concepts of UNIX systems, though hyper-links/footnotes are present where likely needed. 
>
> This covers the syntax for shell script. However, a majority of the function of a script comes from the actual commands, and by extension, a majority of shell script writing is based on remembering the commands for certain actions.

## Help You Help Yourself

The `man` command (short for "manual") is great for a comprehensive breakdown of some command, but demonstrations and examples are better for getting started with a complex command—you'll want the `tldr` command, which you can install using your preferred package manager:

```bash
#!/usr/bin/env bash

# For Debian and its derivatives:
sudo apt install tldr

# For Redhat and its derivatives:
sudo dnf install tldr

# For Arch and its derivatives:
sudo pacman -S tldr
```

It generally follows the same formatting as the `man` command:

```bash
#!/usr/bin/env bash

# See usage examples of basic calculator:
tldr bc
```

## Command Formatting

In a command, you’ll have the command (*duh*) and then the arguments you pass to it.

Of course, there’s regular text arguments (see figure 1 below) but there’s also short-form opts and long-form opts (figures 2/3 respectively).

```bash 
#!/usr/bin/env bash

# Figure 1
# "Hello!" is a normal argument.
echo "Hello!"

# Figure 2
# Ditto, but with a "-n", which disables printing
# the leading newline.
echo -n "Hello!"

# Figure 3
echo --BashEchoHasNoLongformOpt "Hi!"

```

You also don’t ***have*** to quote regular arguments, but you should get used to it because they’re there for handling variables safely to prevent [command injection](https://owasp.org/www-community/attacks/Command_Injection).

> [!NOTE]
>
> Opts may or may not take an argument after them, it all depends on what the program wants, though usually the commands’ respective `man` page will tell you what each opt expects.

## The Shebang

You can append the `.sh` or `.bash` extension to the end of your script, but that doesn't actually tell the system to run it using the correct interpreter.

That job goes to the *shebang* , a line which is unconditionally placed at the very 1st line, which dictates what interpreter is to be used.

```bash
#!/usr/bin/bash
echo "The line above is a shebang to tell the system to use Bash as the interpreter"
```

The above shebang is really common, though more likely you'll want to use this:

```bash
#!/usr/bin/env bash
echo "This shebang does almost the same thing, except Bash can be anywhere else that isn't /usr/bin/bash"
```

It's more flexible.

## Statements

### If

Comprised of the initiator `if`, the result `then`, and additional conditions `elif`, an exception `else` and the closing `fi`.

The `if` statement is simple yet versatile:

```bash
#!/usr/bin/env bash

if command-a; then
	echo "command-a succeeded"
elif command-b; then
	echo "command-a failed but command-b succeeded as a fallback."
else
	echo "Neither command-a nor command-b worked."
fi
```

> [!WARNING]
>
> No, `else if` is NOT the same as `elif` .
>
> `elif` extends an already existing `if` statement, 
> `else if` creates a new `if` statement, requiring you to add an extra `fi` closure.

### While/Until

### For

### Case

### Formatting

So, ( *opinion warning* ), statements can be formatted more ways than they should be allowed to unlike Python.

Again, unlike Python, statements can mix and match delimiters—it’s better to see for yourself:

```bash 
#!/usr/bin/env bash

# A crime against humanity, thou who scripts like this
# shall be ensnared in the circles of hell.
if # Newline delimiter
command-a # No, indentation won't affect interpretation.
then # Another newline delimiter
	# "Actually nevermind I wanna indent here"
	# "Too many newlines, let's use semi-colons instead."
	command-b; elif command-c; then command-d;
fi
```

## Miscellaneous Features

### Command Groups

The opening and closing curly brackets `{}` are used to group multiple commands together, and while typically indifferent from running the commands normally, can be used to manipulate an arbitrary group of commands as if they were 1 process—like piping the output of all the commands in a group to another command.

> [!NOTE]
>
> Command groups require a space after the opening curly bracket `{` and a semi-colon `;` (or a newline/another forms of acceptable delimiters by Bash) after the closing curly bracket `}` like so:
>
> ```bash
> #!/usr/bin/env bash
> {
> 	# Print "Hello!"
> 	# The ">&2" redirects the "Hello!" to fd2/stderr,
>	# which will make it hidden due to the
> 	# directive attached to the command group.
> 	echo "Hello!" >&2
>
> 	# Gives the user a prompt and assigns it to a variable.
> 	# Note: the read command actually prints its provided
>   # prompt to fd2/stderr so 2>&1 is present to revert that 
> 	read -r -p 'How are you?: ' answer_variable 2>&1
>
> 	# This is a dummy, non-existent command and will print an error.
> 	unknown_command
> } 2>/dev/null # This discards data coming from fd2/stderr.
> ```

### Sub-shells (and variable scoping)

Ditto, but `()` opposed to `{}`.

Alike command groups, but with the distinction that everything inside it runs under a new process. A "sub-shell" is ephemeral and will disappear when it finishes. As a result, the following effects can be observed, but note that this is not an exhaustive list:

 * Changes in variables (*including creation and deletion* ) will not trickle up to the parent shell.
 * Changes in variables (*including creation and deletion*) in the parent will not trickle down to the sub-shell *post-creation* of the sub-shell.

Here's an example:

```bash
#!/usr/bin/env bash
# Assign variable "foo" in parent
foo=bar

# Scope: Sub-shell
# Prints "bar".
( echo "${foo}" )

(
	# Re-assigned variable "foo" to "hello" inside of sub-shell.
	foo="hello"
	
	# Scope: Sub-shell
	# Prints "hello"
	echo "${foo}"
)

# Scope: Top
# Prints "bar".
echo "${foo}" 
```

### Unnamed Pipes

Non-persistent inter-process communication between 2 ephemeral processes.

> [!TIP]
>
> Unnamed pipes will actually create a sub-shell, meaning the assignment or reassignment of variables inside pipes will not persist into the parent shell.

> [!NOTE]
>
> There is a better way to use bc than the method shown below, see the section regarding [here-strings](#here-string) for more info.

Signified by the vertical pipe `|` character, redirects the stdout/fd1 of `command-a` to the stdin of `command-b` . (Examples below)

```bash
# Tells bc (basic calculator) to resolve 1+1
# the bc command doesn't take args, it evaluates from stdin
echo "1+1" | bc

# Finds all lines containing the substring "xyz" in the hosts file,
# then tee outputs it to stdout AND writes it to a file named
# results.txt in your CWD (current working directory).
grep "xyz" '/etc/hosts' | tee './results.txt'
```

### Named Pipes

Persistent inter-process communication, generally between a [daemon](https://en.wikipedia.org/wiki/Daemon_(computing)) and an ephemeral process(es).

Usually made by the `mkfifo`[^First in, first out](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) command, can live beyond the lifespan of an arbitrary process—any program can put data into it, and any program can read from it, but ***both must happen simultaneously*** because the data is not stored unlike a normal file.

```bash
# Make a named pipe
mkfifo '/tmp/named_pipe'

# Start reading incoming data (backgrounded via the ampersand, see the below section.)
while read -r line; do
	echo "Received line: ${line}"
done <'/tmp/named_pipe' &

# Send data
echo 'Hello! This is a line of text.' >>'/tmp/named_pipe'
```

### Backgrounding A Process

The Ampersand `&` backgrounds a process when appended to the end of a command like so:

```bash
# This waits 10 seconds from the time of execution,
# then prints "hi" to the terminal while letting
# you run other commands in the meantime.
{ sleep 10; echo 'hi'; } &
```

### Disowning A Process

Ditto, but append " `disown` " after the ampersand `&` to background and *disown* the process.

```bash
# This variation will still continue after you close your terminal.
{ sleep 10; echo 'hi'; } & disown
```

Disowning a process means the parent process (in this scenario, your terminal) can close and the child process won't close along with the parent. 

### Input Redirection

The opening angle bracket `<` feeds data into the command to the left from the file path on the right as seen below:
```bash 
while read -r line; do

	echo "Line recieved: ${line}"

done <'data.txt'

```

( *Yes, a `while` loop counts as a "command"* )

### Here-string

Generally used as an alternative to the below, a here-string `<<<` (triple opening angle bracket) is much cleaner and faster:

```bash
# This is ugly and inefficient:
echo "abc" | command-b # Nope, bad!

# Try this instead:
command-b <<<"abc" # That's better.
```

Feeds a string into a command's stdin without redirecting the stdout of another command, avoids the ambiguity of variations in how `echo` operates across systems, and mitigates the (albeit very minor) performance hit from spawning sub-shells as a result of using [unnamed pipes](#Unnamed-Pipes).