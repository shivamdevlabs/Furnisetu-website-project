@echo off
echo ============================================================
echo Starting Local MongoDB Server for Furnisetu on port 27017...
echo ============================================================
"%~dp0mongodb-bin\mongod.exe" --dbpath "%~dp0data\db" --port 27017 --bind_ip 127.0.0.1
