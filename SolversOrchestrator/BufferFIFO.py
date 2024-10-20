import redis


class BufferFIFO:
    """
    Implements a FIFO queue of JSON strings using Redis' list as a buffer
    """

    def __init__(self, name, host, port, compare=lambda x, y: x == y):
        """
        Keyword arguments:
        - name -- the name of the buffer
        - host -- host name or IP of Redis
        - port -- connection port of Redis
        - compare -- function to be used when comparing a value to an entry of the buffer - returns True if equal otherwise false,
        e.g. lambda entry, value : entry["id"] == value
        """
        self._name = name
        self._compare = compare

        # Initialize Redis connection
        self._redis = redis.Redis(host=host, port=port, decode_responses=True)

    def is_empty(self):
        """
        Returns True is the buffer is empty, otherwise False
        """
        try:
            # Check the length of the queue
            buffer_length = self._redis.llen(self._name)
            return buffer_length == 0
        except:
            return True

    def enqueue(self, value, consume_first=False):
        """
        Add a value to the start (head) of the FIFO queue

        Keyword arguments:
        - value -- the value to be added
        - consume_first -- if True the value will be added to the end (tail) of the queue (in order to get consumed first) (default False)
        """
        if consume_first:
            self._redis.rpush(self._name, value)
        else:
            self._redis.lpush(self._name, value)

    def dequeue(self):
        """
        Get the tail of the queue and remove from the queue
        """
        return self._redis.rpop(self._name)

    def peek(self):
        """
        Get the tail of the queue without removing it from the queue
        """
        tail = self._redis.rpop(self._name)
        self._redis.rpush(self._name, tail)
        return tail

    def find(self, value):
        """
        Find a value in the queue.

        Returns the value if found, otherwise None

        Keyword arguments:
        - value -- the value to be found
        """
        buffer_length = self._redis.llen(self._name)
        for i in range(buffer_length):
            current = self._redis.lindex(self._name, i)

            if self._compare(current, value):
                return current

        return None

    def delete(self, value):
        """
        Delete a value from the queue.

        Returns True if the value was found and deleted, otherwise False

        Keyword arguments:
        - value -- the value to be deleted from the queue
        """
        temp_buffer = []
        deleted = False

        while not self.is_empty() and not deleted:
            current = self.dequeue()
            if self._compare(current, value):
                deleted = True
            else:
                temp_buffer.append(current)

        for v in reversed(temp_buffer):
            self.enqueue(v, True)

        return deleted
