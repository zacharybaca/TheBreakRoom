@echo off
echo Removing all Zone.Identifier files...
for /r %%f in (*.Zone.Identifier) do (
    del "%%f" /f /q
    echo Removed: %%f
)
echo Done!
pause
