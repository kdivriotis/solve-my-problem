# Cleanup users' database volume
sudo rm -rf UsersDatabase/db/.mongodb
sudo rm -rf UsersDatabase/db/diagnostic.data
sudo rm -rf UsersDatabase/db/journal
sudo rm -rf UsersDatabase/db/*

# Cleanup problems' database volume
sudo rm -rf ProblemsDatabase/db/.mongodb
sudo rm -rf ProblemsDatabase/db/diagnostic.data
sudo rm -rf ProblemsDatabase/db/journal
sudo rm -rf ProblemsDatabase/db/*

# Cleanup Kafka logs volume
sudo rm -rf Kafka/data/.lock
sudo rm -rf Kafka/data/.kafka*
sudo rm -rf Kafka/data/*

# Cleanup Redis data volume
sudo rm -rf Redis/data/dump.rdb
sudo rm -rf Redis/data/*
